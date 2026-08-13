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
        <span aria-hidden style={{ display: "block", width: 30, height: 3, background: "#D9912F", marginBottom: 14 }} />
        <h1 style={{ fontFamily: "var(--font-oswald), var(--font-sans)", textTransform: "uppercase", letterSpacing: ".01em", fontSize: "clamp(26px,3vw,36px)", fontWeight: 700, lineHeight: 1, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ margin: "10px 0 0", color: "#4D4D4E" }}>{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref} style={{ padding: "11px 20px", borderRadius: 12, background: "#050505", color: "#fff", fontWeight: 700, fontSize: 14 }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
