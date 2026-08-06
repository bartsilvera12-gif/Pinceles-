"use client";

export function PendingNotice({ reason }: { reason: string }) {
  return (
    <div style={{ maxWidth: 620, background: "#fff", border: "1px solid rgba(217,145,47,.35)", borderRadius: 16, padding: 22 }}>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#050505" }}>Próximamente</p>
      <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "#4D4D4E" }}>{reason}</p>
    </div>
  );
}
