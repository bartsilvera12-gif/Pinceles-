import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Health check para Coolify/monitoreo. No expone secretos.
 * Comprueba que la app responde y, de forma liviana, que hay config de Supabase.
 */
export async function GET() {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return NextResponse.json(
    {
      status: "ok",
      service: "pinceles-web",
      supabaseConfigured: hasSupabase,
      time: new Date().toISOString(),
    },
    { status: 200 }
  );
}
