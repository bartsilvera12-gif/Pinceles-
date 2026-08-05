import Image from "next/image";
import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "#F8F6F1",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          border: "1px solid rgba(5,5,5,.08)",
          borderRadius: 22,
          padding: "clamp(24px,5vw,40px)",
          boxShadow: "0 20px 60px rgba(5,5,5,.10)",
        }}
      >
        <Link href="/" aria-label="Pinceles, inicio" style={{ display: "inline-flex" }}>
          <Image src="/images/logo-pinceles.jpg" alt="Pinceles" width={140} height={119} style={{ height: 54, width: "auto", mixBlendMode: "multiply" }} />
        </Link>
        <h1 style={{ margin: "22px 0 0", fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "#050505" }}>{title}</h1>
        {subtitle && <p style={{ margin: "8px 0 0", fontSize: 14, color: "#4D4D4E" }}>{subtitle}</p>}
        <div style={{ marginTop: 26 }}>{children}</div>
        {footer && <div style={{ marginTop: 20, fontSize: 14 }}>{footer}</div>}
      </div>
    </main>
  );
}
