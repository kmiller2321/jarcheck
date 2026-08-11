import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const email = String(req.query.email || "").toLowerCase().trim();
  const token = String(req.query.token || "");

  if (!email || !token) {
    return res.status(400).send("Missing email or token.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).send("Unsubscribe storage isn't configured.");
  }

  const { data, error } = await supabase
    .from("subscribers")
    .update({ opt_in_weekly: false })
    .eq("email", email)
    .eq("unsubscribe_token", token)
    .select()
    .maybeSingle();

  if (error || !data) {
    return res.status(400).send("Invalid or expired unsubscribe link.");
  }

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(
    `<!DOCTYPE html><html><body style="font-family: sans-serif; text-align: center; padding: 60px 20px;">
      <h2>You're unsubscribed</h2>
      <p>${email} will no longer receive JarCheck Weekly emails.</p>
    </body></html>`,
  );
}
