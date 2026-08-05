import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ margin: "6px 0 0", color: "#4D4D4E" }}>{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref} style={{ padding: "11px 20px", borderRadius: 12, background: "#050505", color: "#fff", fontWeight: 700, fontSize: 14 }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
