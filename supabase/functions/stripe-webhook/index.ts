import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function addSubscriberToKit(email: string, name: string, kitApiKey: string, kitApiSecret: string) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const tags = ["beta-paid", "beta-user", `joined-${currentMonth}`];

  const kitUrl = "https://api.convertkit.com/v3/tags";

  for (const tag of tags) {
    const tagResponse = await fetch(`${kitUrl}/${tag}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: kitApiKey,
        api_secret: kitApiSecret,
        email: email,
        first_name: name,
      }),
    });

    if (!tagResponse.ok) {
      const errorText = await tagResponse.text();
      throw new Error(`Failed to tag ${tag}: ${errorText}`);
    }
  }

  const subscribersResponse = await fetch(`https://api.convertkit.com/v3/subscribers?api_secret=${kitApiSecret}&email_address=${encodeURIComponent(email)}`);

  if (subscribersResponse.ok) {
    const data = await subscribersResponse.json();
    if (data.subscribers && data.subscribers.length > 0) {
      return data.subscribers[0].id.toString();
    }
  }

  return null;
}

async function logKitFailure(supabase: any, signupId: string, email: string, errorMessage: string) {
  await supabase
    .from("kit_sync_failures")
    .insert({
      signup_id: signupId,
      email: email,
      error_message: errorMessage,
      retry_count: 0,
    });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const kitApiKey = Deno.env.get("KIT_API_KEY");
    const kitApiSecret = Deno.env.get("KIT_API_SECRET");

    if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-12-18.acacia",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No signature found");
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const signupId = session.metadata?.signupId;

      if (signupId) {
        const { data: signup } = await supabase
          .from("beta_signups")
          .select("email, name")
          .eq("id", signupId)
          .single();

        await supabase
          .from("beta_signups")
          .update({
            payment_status: "completed",
            stripe_payment_id: session.payment_intent as string,
          })
          .eq("id", signupId);

        if (kitApiKey && kitApiSecret && signup) {
          try {
            const kitSubscriberId = await addSubscriberToKit(
              signup.email,
              signup.name,
              kitApiKey,
              kitApiSecret
            );

            if (kitSubscriberId) {
              await supabase
                .from("beta_signups")
                .update({ kit_subscriber_id: kitSubscriberId })
                .eq("id", signupId);

              console.log(`Successfully tagged ${signup.email} in Kit with subscriber ID ${kitSubscriberId}`);
            }
          } catch (kitError) {
            console.error("Kit API error:", kitError);
            await logKitFailure(supabase, signupId, signup.email, kitError.message);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
