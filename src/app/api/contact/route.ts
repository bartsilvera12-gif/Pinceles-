import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validations/contact";

export const runtime = "nodejs";

// Rate limiting muy básico en memoria (por IP). Para producción multi-instancia
// conviene un store compartido; alcanza como primera barrera anti-spam.
const HITS = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    HITS.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_HITS;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos. Probá de nuevo en un minuto." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Revisá los campos.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const d = parsed.data;

  // Honeypot: si viene relleno, respondemos ok sin guardar (bot).
  if (d.website) return NextResponse.json({ ok: true });

  // Sin service_role no podemos guardar en la base (RLS). Igual dejamos que el
  // usuario continúe a WhatsApp: respondemos ok sin persistir.
  if (!hasServiceRole()) {
    return NextResponse.json({ ok: true, saved: false });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .schema("pinceles")
      .from("contact_submissions")
      .insert({
        name: d.name,
        company: d.company || null,
        phone: d.phone,
        email: d.email || null,
        service_id: d.serviceId || null,
        service_name_snapshot: d.serviceName || null,
        location: d.location || null,
        message: d.message || null,
        source: "web",
        status: "nuevo",
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: data?.id });
  } catch {
    // No exponemos detalles internos.
    return NextResponse.json(
      { ok: false, error: "No pudimos registrar la solicitud. Escribinos por WhatsApp." },
      { status: 500 }
    );
  }
}
