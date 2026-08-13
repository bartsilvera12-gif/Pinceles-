"use client";

import { useState } from "react";
import type { NavigationItem, SiteSettings } from "@/types/database.types";

const LOGO_FALLBACK = "/images/logo-pinceles.jpg";

export function IndHeader({ settings, navigation }: { settings: SiteSettings | null; navigation: NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const logo = settings?.logo_url || LOGO_FALLBACK;
  const nav = navigation.filter((n) => n.is_visible !== false);
  // Los anchors (#servicios) viven en la home: desde otras rutas se prefijan con "/".
  const href = (h: string) => (h?.startsWith("#") ? `/${h}` : h || "#");

  return (
    <header className="ind-header">
      <div className="ind-wrap ind-nav">
        <a href="/" className="ind-brand" aria-label={settings?.company_name ?? "Pinceles"}>
          <img className="ind-brand-logo" src={logo} alt={settings?.company_name ?? "Pinceles"} />
        </a>
        <nav className="ind-nav-links">
          {nav.map((l) => (
            <a key={l.id} href={href(l.href)} target={l.open_new_tab ? "_blank" : undefined} rel={l.open_new_tab ? "noopener" : undefined}>{l.label}</a>
          ))}
        </nav>
        <a className="ind-nav-cta" href="/#contacto">Pedir presupuesto</a>
        <button type="button" className="ind-burger" aria-label="Menú" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="ind-mobile-menu">
          {nav.map((l) => (
            <a key={l.id} href={href(l.href)} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a className="ind-nav-cta" href="/#contacto" onClick={() => setOpen(false)} style={{ marginTop: 8 }}>Pedir presupuesto</a>
        </div>
      )}
    </header>
  );
}
