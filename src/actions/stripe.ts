import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" as any }) 
  : null;

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: { billingCycle: "monthly" | "annually" }) => data)
  .handler(async ({ data }) => {
    // If no Stripe key is provided, we simulate a successful redirect
    if (!stripe) {
      console.warn("⚠️ No STRIPE_SECRET_KEY found. Falling back to mock checkout.");
      return { url: "/onboarding" };
    }

    try {
      // Create a real Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Clarity Team Plan",
                description: `Team Plan (${data.billingCycle})`,
              },
              unit_amount: data.billingCycle === "annually" ? 12000 : 1200, // $120.00 or $12.00
              recurring: {
                interval: data.billingCycle === "annually" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        // Assume localhost:5173 for local dev, should use env var for production
        success_url: `${process.env.PUBLIC_URL || 'http://localhost:5173'}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.PUBLIC_URL || 'http://localhost:5173'}/`,
      });

      return { url: session.url };
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      throw new Error(error.message || "Failed to create Stripe checkout session");
    }
  });
