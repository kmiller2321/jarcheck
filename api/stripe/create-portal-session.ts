import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getStripeClient } from "../_lib/stripe.js";
import { getSupabaseAdmin } from "../_lib/supabase.js";

/**
 * Lets an existing subscriber manage/cancel their subscription
 * ("cancel anytime in 1 click") without needing a full login system --
 * they enter the email they subscribed with, and we look up their
 * Stripe customer id from Supabase.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = getStripeClient();
  const supabase = getSupabaseAdmin();
  if (!stripe || !supabase) {
    return res.status(500).json({ error: "Billing isn't configured yet." });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }

    const { data: subscriber } = await supabase
      .from("subscribers")
      .select("stripe_customer_id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (!subscriber?.stripe_customer_id) {
      return res.status(404).json({ error: "No active subscription found for that email." });
    }

    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscriber.stripe_customer_id,
      return_url: `${appUrl}/`,
    });

    return res.json({ url: portalSession.url });
  } catch (err: any) {
    console.error("Stripe portal session error:", err);
    return res.status(500).json({ error: "Failed to open billing portal." });
  }
}
