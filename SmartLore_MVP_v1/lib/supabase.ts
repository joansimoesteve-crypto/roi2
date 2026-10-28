import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function supabaseConfigured() {
  return Boolean(url && key && !url.includes("YOUR_PROJECT") && !key.includes("YOUR_SUPABASE"));
}

export function getSupabase() {
  if (!url || !key) throw new Error("Faltan las variables de Supabase.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}