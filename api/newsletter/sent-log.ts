import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../_lib/supabase.js";

// Lightweight protection since there's no full admin auth system yet --
// set ADMIN_KEY in your env and pass it as ?key=... to view the log.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (process.env.ADMIN_KEY && req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({ error: "Storage isn't configured." });
  }

  const { data, error } = await supabase
    .from("sent_emails")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(20);

  if (error) {
    return res.status(500).json({ error: "Failed to load sent log." });
  }

  const { count } = await supabase.from("sent_emails").select("*", { count: "exact", head: true });

  return res.json({ totalSent: count || 0, recentSent: data });
}
