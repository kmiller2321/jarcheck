import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getStripeClient } from "../_lib/stripe.js";
import { getSupabaseAdmin } from "../_lib/supabase.js";

// Combines create-checkout-session + create-portal-session into ONE Vercel
// function (instead of 2) to help stay under the Hobby plan's 12-function
// limit. webhook.ts stays separate since it needs raw-body handling that
// would break normal JSON parsing for these two if combined into it.
export default async function handler(req: VercelRequest, res: VercelResponse) {
// Read the route segment directly from the URL instead of relying on
  // Vercel to auto-populate req.query.route -- on some deployments that
  // value doesn't get filled in for plain (non-Next.js) catch-all routes.
  const urlPath = (req.url || '').split('?')[0];
  const segments = urlPath.split('/').filter(Boolean);
  const route = segments[segments.length - 1] || '';

  if (route === "create-checkout-session") return handleCreateCheckoutSession(req, res);
  if (route === "create-portal-session") return handleCreatePortalSession(req, res);
  return res.status(404).json({ error: "Unknown stripe endpoint." });
}

async function handleCreateCheckoutSession(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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

async function handleCreatePortalSession(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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
