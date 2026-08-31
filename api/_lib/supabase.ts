import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * Server-side Supabase client using the SERVICE ROLE key.
 * NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser/frontend.
 * Returns null if env vars aren't configured yet, so routes can
 * fail gracefully instead of crashing the whole function.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    cachedClient = null;
    return null;
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return cachedClient;
}
