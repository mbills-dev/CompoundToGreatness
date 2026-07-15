import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function getOrCreateTagId(tagName: string, kitApiKey: string): Promise<number> {
  const listRes = await fetch(`https://api.convertkit.com/v3/tags?api_key=${kitApiKey}`);
  if (!listRes.ok) throw new Error(`Failed to list Kit tags: ${await listRes.text()}`);
  const { tags } = await listRes.json();

  const existing = tags.find((t: { id: number; name: string }) => t.name === tagName);
  if (existing) return existing.id;

  const createRes = await fetch("https://api.convertkit.com/v3/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: kitApiKey, tag: { name: tagName } }),
  });
  if (!createRes.ok) throw new Error(`Failed to create Kit tag "${tagName}": ${await createRes.text()}`);
  const { id } = await createRes.json();
  return id;
}

async function tagSubscriber(tagId: number, email: string, name: string, kitApiKey: string) {
  const res = await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: kitApiKey, email, first_name: name }),
  });
  if (!res.ok) throw new Error(`Failed to tag subscriber in Kit (tag ${tagId}): ${await res.text()}`);
  return res.json();
}

async function getKitSubscriberId(email: string, kitApiSecret: string): Promise<string | null> {
  const res = await fetch(
    `https://api.convertkit.com/v3/subscribers?api_secret=${kitApiSecret}&email_address=${encodeURIComponent(email)}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.subscribers?.length > 0) return data.subscribers[0].id.toString();
  return null;
}

async function addSubscriberToKit(
  email: string,
  name: string,
  kitApiKey: string,
  kitApiSecret: string,
  tags: string[]
) {
  for (const tagName of tags) {
    const tagId = await getOrCreateTagId(tagName, kitApiKey);
    await tagSubscriber(tagId, email, name, kitApiKey);
  }
  return await getKitSubscriberId(email, kitApiSecret);
}

async function logKitFailure(supabase: ReturnType<typeof createClient>, signupId: string, email: string, errorMessage: string) {
  await supabase
    .from("kit_sync_failures")
    .insert({ signup_id: signupId, email, error_message: errorMessage, retry_count: 0 });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const kitApiKey = Deno.env.get("KIT_API_KEY");
    const kitApiSecret = Deno.env.get("KIT_SECRET_KEY");

    if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No signature found");

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const signupId = session.metadata?.signupId;
      const metaEmail = session.metadata?.email;
      const metaName = session.metadata?.name;

      if (signupId) {
        const { data: signup } = await supabase
          .from("beta_signups")
          .select("email, name")
          .eq("id", signupId)
          .maybeSingle();

        await supabase
          .from("beta_signups")
          .update({
            payment_status: "completed",
            stripe_payment_id: (session.subscription ?? session.payment_intent) as string,
          })
          .eq("id", signupId);

        const email = signup?.email ?? metaEmail;
        const name = signup?.name ?? metaName ?? "";

        const appSupabaseUrl = Deno.env.get("C2G_APP_SUPABASE_URL");
        const appWebhookSecret = Deno.env.get("C2G_APP_WEBHOOK_SECRET");
        if (appSupabaseUrl && appWebhookSecret && email) {
          try {
            const fmRes = await fetch(`${appSupabaseUrl}/functions/v1/register-founding-member`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-webhook-secret": appWebhookSecret,
              },
              body: JSON.stringify({
                email,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: (session.subscription ?? null) as string | null,
                purchased_at: new Date().toISOString(),
              }),
            });
            if (!fmRes.ok) {
              console.error("Failed to register founding member in app project:", await fmRes.text());
            }
          } catch (fmError) {
            console.error("Founding member sync error:", fmError);
          }
        }
        if (kitApiKey && kitApiSecret && email) {
          try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const kitSubscriberId = await addSubscriberToKit(
              email,
              name,
              kitApiKey,
              kitApiSecret,
              ["founding-member", "founding-member-paid", `joined-${currentMonth}`]
            );

            if (kitSubscriberId) {
              await supabase
                .from("beta_signups")
                .update({ kit_subscriber_id: kitSubscriberId })
                .eq("id", signupId);
            }

            console.log(`Successfully tagged ${email} in Kit`);
          } catch (kitError) {
            console.error("Kit API error:", kitError);
            await logKitFailure(supabase, signupId, email, kitError.message);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
