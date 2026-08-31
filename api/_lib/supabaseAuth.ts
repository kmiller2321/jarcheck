import type { VercelRequest } from "@vercel/node";
import { getSupabaseAdmin } from "./supabase.js";

/**
 * Verifies the Supabase access token sent as "Authorization: Bearer <token>"
 * and returns the authenticated user's verified email, or null if missing/
 * invalid. Never trust an email passed directly in a request body for
 * anything account-related -- always resolve it from the verified token.
 */
export async function getAuthedEmail(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.slice("Bearer ".length);
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user?.email) return null;

  return data.user.email.toLowerCase().trim();
}
