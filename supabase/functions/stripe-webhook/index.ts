// Supabase Edge Function: stripe-webhook
// Listens for Stripe webhook events and updates the subscriptions table.
import Stripe from "https://esm.sh/stripe@17?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      console.error("Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env var");
      return new Response(JSON.stringify({ error: "Missing signature or webhook secret" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret,
        undefined,
        cryptoProvider
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a Supabase admin client (service_role key for backend operations)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`📦 Received Stripe event: ${event.type} (${event.id})`);

    // Handle the events we care about
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract workspace_id from the session metadata
        const workspaceId = session.metadata?.workspace_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!workspaceId) {
          console.warn("checkout.session.completed missing workspace_id in metadata. Skipping.");
          break;
        }

        console.log(`✅ Checkout completed for workspace ${workspaceId}`);

        // Upsert the subscription record
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert(
            {
              workspace_id: workspaceId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_id: session.metadata?.plan_id || "team",
              status: "active",
              current_period_end: null, // Will be populated by subscription.updated
            },
            { onConflict: "workspace_id" }
          );

        if (error) {
          console.error("Failed to upsert subscription:", error);
          return new Response(JSON.stringify({ error: "Database error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        console.log(`💾 Subscription record created/updated for workspace ${workspaceId}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Map Stripe status to our status
        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          canceled: "canceled",
          unpaid: "unpaid",
          trialing: "trialing",
          incomplete: "incomplete",
        };

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: statusMap[subscription.status] || subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed to update subscription status:", error);
        } else {
          console.log(`🔄 Subscription updated for customer ${customerId}: ${subscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed to cancel subscription:", error);
        } else {
          console.log(`🚫 Subscription canceled for customer ${customerId}`);
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
