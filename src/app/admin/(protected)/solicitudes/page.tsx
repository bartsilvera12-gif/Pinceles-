import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import type { ContactSubmission } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function SolicitudesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("pinceles")
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Solicitudes" subtitle="Consultas recibidas desde el formulario del sitio." />
      <SubmissionsTable submissions={(data as ContactSubmission[] | null) ?? []} />
    </div>
  );
}
