import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthedEmail } from "../_lib/supabaseAuth.js";
import { getSupabaseAdmin } from "../_lib/supabase.js";

const ACTIVE_STATUSES = new Set(["trialing", "active"]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const email = await getAuthedEmail(req);
  if (!email) {
    return res.status(401).json({ error: "Not logged in." });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({ error: "Storage isn't configured." });
  }

  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("subscription_status")
    .eq("email", email)
    .maybeSingle();

  const status = subscriber?.subscription_status || null;

  return res.json({
    email,
    subscriptionStatus: status,
    isActiveSubscriber: !!status && ACTIVE_STATUSES.has(status),
  });
}
