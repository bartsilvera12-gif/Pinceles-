/**
 * scripts/create-admin.ts
 * Crea (o asegura) el primer super_admin de forma segura e idempotente.
 *
 * Uso:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/create-admin.ts
 * (las variables suelen venir de .env.local — ver README/CREAR_ADMIN.md)
 *
 * - Crea el usuario en Supabase Auth (o reutiliza el existente).
 * - Crea/actualiza su perfil en pinceles.admin_profiles con rol super_admin.
 * - NO imprime ni almacena la contraseña.
 * - Requiere SUPABASE_SERVICE_ROLE_KEY (solo servidor).
 */
import { createClient } from "@supabase/supabase-js";

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Falta la variable de entorno ${name}`);
    process.exit(1);
  }
  return v;
}

async function main(): Promise<void> {
  const url = required("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY");
  const email = required("ADMIN_EMAIL").trim().toLowerCase();
  const password = required("ADMIN_PASSWORD");
  const fullName = (process.env.ADMIN_FULL_NAME || "Administrador").trim();

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1) ¿Existe ya el usuario en Auth?
  let userId: string | undefined;
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listErr) {
    console.error("✗ No se pudo listar usuarios:", listErr.message);
    process.exit(1);
  }
  const existing = list.users.find((u) => u.email?.toLowerCase() === email);

  if (existing) {
    userId = existing.id;
    console.log("• Usuario ya existente en Auth, se reutiliza.");
  } else {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr || !created.user) {
      console.error("✗ No se pudo crear el usuario:", createErr?.message);
      process.exit(1);
    }
    userId = created.user.id;
    console.log("✓ Usuario creado en Auth.");
  }

  // 2) Upsert del perfil administrativo (rol super_admin, activo)
  const { error: profileErr } = await admin
    .schema("pinceles")
    .from("admin_profiles")
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        role: "super_admin",
        is_active: true,
      },
      { onConflict: "id" }
    );

  if (profileErr) {
    console.error("✗ No se pudo crear el perfil administrativo:", profileErr.message);
    process.exit(1);
  }

  console.log(`✓ super_admin listo para ${email}. (La contraseña no se muestra ni se guarda.)`);
  process.exit(0);
}

main().catch((e) => {
  console.error("✗ Error inesperado:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
