"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import type { NavigationItem, SiteSettings } from "@/types/database.types";
import { whatsappUrl } from "@/lib/utils";

export function Header({
  settings,
  navigation,
}: {
  settings: SiteSettings | null;
  navigation: NavigationItem[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  const wa = whatsappUrl(settings?.whatsapp_number, settings?.whatsapp_default_message);
  const logo = settings?.logo_url ?? "/images/logo-pinceles.jpg";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const ids = ["inicio", "servicios", "nosotros", "proyectos", "industrias", "contacto"];
      let cur = active;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) cur = id;
      }
      setActive(cur);
    };
    const onResize = () => setMobile(window.innerWidth < 1080);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onResize();
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: scrolled ? "rgba(255,255,255,.92)" : "rgba(248,246,241,.55)",
        boxShadow: scrolled ? "0 6px 24px rgba(5,5,5,.08)" : "none",
        transition: "background .35s ease, box-shadow .35s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "12px clamp(16px, 3vw, 36px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <a href="#inicio" aria-label="Pinceles, inicio" style={{ display: "flex", flexShrink: 0 }}>
          <Image
            src={logo}
            alt={settings?.logo_alt ?? "Logo de Pinceles"}
            width={140}
            height={119}
            style={{ height: 62, width: "auto", mixBlendMode: "multiply" }}
            priority
          />
        </a>

        {!mobile && (
          <nav aria-label="Navegación principal" style={{ display: "flex", alignItems: "center", gap: "clamp(14px,1.8vw,30px)" }}>
            {navigation.map((l) => {
              const on = active === l.href.replace("#", "");
              return (
                <a
                  key={l.id}
                  href={l.href}
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: on ? "#D9912F" : "#050505",
                    padding: "6px 0",
                    borderBottom: `2px solid ${on ? "#D9912F" : "transparent"}`,
                  }}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
        )}

        {!mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid rgba(5,5,5,.14)",
                borderRadius: 12,
                padding: "8px 14px",
                color: "#050505",
              }}
            >
              <span style={{ color: "#D9912F", flexShrink: 0 }}>
                <WhatsAppIcon size={20} />
              </span>
              <span style={{ lineHeight: 1.15 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>
                  {settings?.phone_display ?? ""}
                </span>
                <span style={{ display: "block", fontSize: 11, color: "#4D4D4E", fontWeight: 500 }}>
                  Atención por WhatsApp
                </span>
              </span>
            </a>
            <a
              href="#contacto"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "#050505",
                color: "#ffffff",
                borderRadius: 12,
                padding: "13px 20px",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <Icon name="file-text" size={18} />
              Solicitar presupuesto
            </a>
          </div>
        )}

        {mobile && (
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              border: "1px solid rgba(5,5,5,.14)",
              borderRadius: 12,
              background: "#ffffff",
              cursor: "pointer",
              color: "#050505",
            }}
          >
            <Icon name="menu" size={24} />
          </button>
        )}
      </div>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            background: "#F8F6F1",
            padding: "20px clamp(18px,5vw,40px) 40px",
            display: "flex",
            flexDirection: "column",
            animation: "pincelIn .28s ease both",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Image src={logo} alt="Pinceles" width={140} height={119} style={{ height: 58, width: "auto", mixBlendMode: "multiply" }} />
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                border: "1px solid rgba(5,5,5,.14)",
                borderRadius: 12,
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              <Icon name="x" size={24} />
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 32 }}>
            {navigation.map((l) => (
              <a
                key={l.id}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 30,
                  fontWeight: 600,
                  color: "#050505",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(5,5,5,.08)",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
            <a
              href="#contacto"
              onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#D9912F", color: "#050505", fontWeight: 700, padding: 18, borderRadius: 14 }}
            >
              Solicitar presupuesto
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, border: "1px solid #050505", color: "#050505", fontWeight: 700, padding: 18, borderRadius: 14 }}
            >
              <WhatsAppIcon size={20} />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
