import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function tagSubscriberInKit(email: string, name: string, tagName: string, kitApiKey: string) {
  const listRes = await fetch(`https://api.convertkit.com/v3/tags?api_key=${kitApiKey}`);
  if (!listRes.ok) throw new Error(`Failed to list Kit tags: ${await listRes.text()}`);
  const { tags } = await listRes.json();

  let tagId: number;
  const existing = tags.find((t: { id: number; name: string }) => t.name === tagName);
  if (existing) {
    tagId = existing.id;
  } else {
    const createRes = await fetch("https://api.convertkit.com/v3/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: kitApiKey, tag: { name: tagName } }),
    });
    if (!createRes.ok) throw new Error(`Failed to create Kit tag "${tagName}": ${await createRes.text()}`);
    const created = await createRes.json();
    tagId = created.id;
  }

  const subRes = await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: kitApiKey, email, first_name: name }),
  });
  if (!subRes.ok) throw new Error(`Failed to tag subscriber in Kit: ${await subRes.text()}`);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe secret key not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const kitApiKey = Deno.env.get("KIT_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    const { name, email } = await req.json();

    const { data: signup, error: signupError } = await supabase
      .from("beta_signups")
      .upsert(
        { name, email, payment_status: "pending" },
        { onConflict: "email" }
      )
      .select()
      .maybeSingle();

    if (signupError) throw new Error(`DB error: ${signupError.message}`);

    // Tag as beta-user immediately on form submit, before checkout
    if (kitApiKey) {
      try {
        await tagSubscriberInKit(email, name, "beta-user", kitApiKey);
        console.log(`Tagged ${email} as beta-user in Kit`);
      } catch (kitError) {
        // Non-fatal: log but don't block checkout
        console.error("Kit pre-checkout tag error:", kitError);
      }
    }

    const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || "https://compoundtogreatness.com";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1TGKnMBBbbxqlK8j4rtOwaJa",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#start`,
      customer_email: email,
      metadata: {
        signupId: signup?.id ?? null,
        name,
        email,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
