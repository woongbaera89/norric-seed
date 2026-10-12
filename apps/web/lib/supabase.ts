import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public values (safe to ship; RLS protects data). Override via env per environment.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hywqkiekcxavtbsvgvqk.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_t9yWW_-rXao14UErdRWWrw_MMh7xUfg";

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  client ??= createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, detectSessionInUrl: true, flowType: "implicit" } });
  return client;
}
