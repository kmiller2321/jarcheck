import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// null when not configured yet, so login UI can show a friendly message
// instead of crashing the whole app.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isAuthConfigured = !!supabase;
