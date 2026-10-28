import { NextResponse } from "next/server";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Correo no válido." }, { status: 400 });
    }
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: "Configura Supabase en las variables de entorno." }, { status: 503 });
    }
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin }
    });
    if (error) return NextResponse.json({ error: "No se pudo enviar el enlace de acceso." }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }
}