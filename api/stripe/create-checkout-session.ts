import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getStripeClient } from "../_lib/stripe.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = getStripeClient();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return res.status(500).json({
      error: "Stripe isn't configured yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.",
    });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email is required." });
    }

    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email.toLowerCase().trim(),
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 15,
        metadata: { email: email.toLowerCase().trim() },
      },
      metadata: { email: email.toLowerCase().trim() },
      allow_promotion_codes: true,
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout session error:", err);
    return res.status(500).json({ error: "Failed to start checkout." });
  }
}
