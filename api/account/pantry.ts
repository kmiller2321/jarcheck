import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthedEmail } from "../_lib/supabaseAuth.js";
import { getSupabaseAdmin } from "../_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const email = await getAuthedEmail(req);
  if (!email) {
    return res.status(401).json({ error: "Not logged in." });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({ error: "Storage isn't configured." });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("pantry_items")
      .select("data")
      .eq("subscriber_email", email)
      .order("updated_at", { ascending: false });

    if (error) return res.status(500).json({ error: "Failed to load pantry." });
    return res.json({ batches: (data || []).map((row) => row.data) });
  }

  if (req.method === "POST") {
    const { batch } = req.body || {};
    if (!batch || !batch.id) {
      return res.status(400).json({ error: "A pantry batch with an id is required." });
    }

    const { error } = await supabase
      .from("pantry_items")
      .upsert(
        { subscriber_email: email, id: batch.id, data: batch, updated_at: new Date().toISOString() },
        { onConflict: "subscriber_email,id" },
      );

    if (error) return res.status(500).json({ error: "Failed to save pantry item." });
    return res.json({ success: true });
  }

  if (req.method === "DELETE") {
    const id = String(req.query.id || "");
    if (!id) return res.status(400).json({ error: "id is required." });

    const { error } = await supabase
      .from("pantry_items")
      .delete()
      .eq("subscriber_email", email)
      .eq("id", id);

    if (error) return res.status(500).json({ error: "Failed to delete pantry item." });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
