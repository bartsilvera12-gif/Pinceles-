import { PageHeader } from "@/components/admin/PageHeader";

export function ComingSoon({ title, note }: { title: string; note?: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <div style={{ background: "#fff", border: "1px dashed rgba(5,5,5,.18)", borderRadius: 16, padding: 40, textAlign: "center", color: "#4D4D4E" }}>
        <p style={{ margin: 0, fontSize: 15 }}>Módulo en construcción.</p>
        {note && <p style={{ margin: "8px 0 0", fontSize: 13 }}>{note}</p>}
      </div>
    </div>
  );
}
