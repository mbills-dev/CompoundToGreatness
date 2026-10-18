import { createClient } from "@supabase/supabase-js";

const authUrl = import.meta.env.VITE_CTG_AUTH_SUPABASE_URL;
const authAnonKey = import.meta.env.VITE_CTG_AUTH_SUPABASE_ANON_KEY;

if (!authUrl || !authAnonKey) {
  throw new Error(
    "CTG auth Supabase env vars are missing. Set VITE_CTG_AUTH_SUPABASE_URL and VITE_CTG_AUTH_SUPABASE_ANON_KEY."
  );
}

export const authSupabase = createClient(authUrl, authAnonKey, {
  auth: {
    flowType: "implicit",
    detectSessionInUrl: false,
    persistSession: false,
    autoRefreshToken: false,
  },
});
