"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicSiteContent } from "@/lib/data/get-public-site-content";
import { ContactForm } from "@/components/site/ContactForm";
import { IndHeader } from "@/components/site/ind/IndHeader";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappUrl } from "@/lib/utils";

const LOGO_FALLBACK = "/images/logo-pinceles.jpg";

export function HomeRedesign({ content: c }: { content: PublicSiteContent }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wa = whatsappUrl(c.settings?.whatsapp_number, c.settings?.whatsapp_default_message);
  const sec = (k: string) => c.sections[k];
  const address = [c.settings?.address, c.settings?.city, c.settings?.country].filter(Boolean).join(", ");
  const mapsUrl = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "#";

  const hideProject = (p: (typeof c.projects)[number]) => {
    const s = [p.title, p.cover_image_url, p.cover_image_alt, ...(p.images?.map((i) => i.image_url) ?? [])]
      .filter(Boolean).join(" ").toLowerCase();
    return s.includes("proj-torre") || s.includes("torre residencial");
  };
  const projects = c.projects.filter((p) => !hideProject(p)).slice(0, 6);
  const logo = c.settings?.logo_url || LOGO_FALLBACK;
  const nav = c.navigation.filter((n) => n.is_visible !== false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // reveals
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    root.querySelectorAll(".ind-reveal").forEach((el) => io.observe(el));

    // count-up
    const cUp = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const raw = el.dataset.value ?? "";
        const m = raw.match(/^(\D*)(\d[\d.,]*)(.*)$/);
        if (!m) { el.textContent = raw; cUp.unobserve(el); return; }
        const pre = m[1] ?? "", num = m[2] ?? "", suf = m[3] ?? "";
        const target = parseInt(num.replace(/[.,]/g, ""), 10);
        if (reduce || !isFinite(target)) { el.textContent = raw; cUp.unobserve(el); return; }
        let n = 0; const step = Math.max(1, Math.round(target / 42));
        const tick = () => { n = Math.min(target, n + step); el.textContent = `${pre}${n}${suf}`; if (n < target) requestAnimationFrame(tick); };
        tick(); cUp.unobserve(el);
      });
    }, { threshold: 0.5 });
    root.querySelectorAll<HTMLElement>("[data-value]").forEach((el) => cUp.observe(el));

    // animated technical grid
    let raf = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let w = 0, h = 0, t = 0;
    const GAP = 46;
    const resize = () => { if (!canvas) return; w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(5,5,5,.07)"; ctx.lineWidth = 1;
      const off = (t * 0.25) % GAP;
      for (let x = -off; x < w; x += GAP) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = -off; y < h; y += GAP) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      const nx = (Math.sin(t / 90) * 0.5 + 0.5) * w, ny = (Math.cos(t / 70) * 0.5 + 0.5) * h;
      const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, 260);
      g.addColorStop(0, "rgba(217,145,47,.16)"); g.addColorStop(1, "rgba(217,145,47,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      t += 1; raf = requestAnimationFrame(draw);
    };
    if (ctx && !reduce) { resize(); window.addEventListener("resize", resize); draw(); }

    return () => { io.disconnect(); cUp.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const heroImg = "/images/hero-viga.jpg";
  const heroBtn1 = { text: c.hero?.primary_button_text || "Pedir presupuesto", url: c.hero?.primary_button_url || "#contacto" };
  const heroBtn2 = { text: c.hero?.secondary_button_text || "Ver proyectos", url: c.hero?.secondary_button_url || "#proyectos" };
  const ctaBase = (c.cta?.title ?? "").replace(c.cta?.highlighted_text ?? "", "").trim();

  return (
    <div className="ind-root" ref={rootRef}>
      <canvas className="ind-grid-bg" ref={canvasRef} aria-hidden />
      <div className="ind-page">
        {/* HEADER */}
        <IndHeader settings={c.settings} navigation={c.navigation} />

        {/* HERO */}
        {c.hero && (
          <section id="inicio" className="ind-hero">
            <div className="ind-hero-bg">
              <img src={heroImg} alt={c.hero.image_alt ?? "Pinceles"} style={{ transform: "scaleX(-1)" }} />
            </div>
            <div className="ind-wrap">
              <div className="ind-hero-copy">
                {c.hero.eyebrow && <span className="ind-label">{c.hero.eyebrow}</span>}
                <h1 className="ind-h1">
                  {c.hero.title_before_highlight}
                  {c.hero.highlighted_text && <> <em>{c.hero.highlighted_text}</em> </>}
                  {c.hero.title_after_highlight}
                </h1>
                {c.hero.description && <p className="ind-hero-desc">{c.hero.description}</p>}
                <div className="ind-hero-cta">
                  <a className="ind-btn ind-btn-primary" href={heroBtn1.url}>{heroBtn1.text} →</a>
                  <a className="ind-btn ind-btn-ghost" href={heroBtn2.url}>{heroBtn2.text}</a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STATS */}
        {c.statistics.length > 0 && (
          <div className="ind-stats">
            <div className="ind-wrap ind-stats-grid">
              {c.statistics.slice(0, 4).map((s) => (
                <div className="ind-stat" key={s.id}>
                  <div className="n" data-value={s.value}>{s.value}</div>
                  <div className="t">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICIOS */}
        {c.services.length > 0 && (
          <section id="servicios" className="ind-block">
            <div className="ind-wrap">
              <div className="ind-sec-head ind-reveal">
                <div>
                  <span className="ind-label">{sec("services")?.eyebrow ?? "Servicios"}</span>
                  <h2 className="ind-h2-mt">{sec("services")?.title ?? "Soluciones para cada superficie"}</h2>
                </div>
                {sec("services")?.description && <p>{sec("services")?.description}</p>}
              </div>
              <div className="ind-svc">
                {c.services.map((s) => (
                  <a key={s.id} className="ind-svc-row ind-reveal" href={s.button_url || "#contacto"}>
                    <h3>{s.title}</h3>
                    <span className="desc">{s.short_description}</span>
                    <span className="ind-arrow">→</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PROYECTOS */}
        {projects.length > 0 && (
          <section id="proyectos" className="ind-block" style={{ paddingTop: 0 }}>
            <div className="ind-wrap">
              <div className="ind-sec-head ind-reveal">
                <div>
                  <span className="ind-label">{sec("projects")?.eyebrow ?? "Proyectos"}</span>
                  <h2 className="ind-h2-mt">{sec("projects")?.title ?? "Trabajos realizados"}</h2>
                </div>
                <Link className="ind-btn ind-btn-ghost" href="/proyectos">Ver todos →</Link>
              </div>
              <div className="ind-proj">
                {projects.map((p) => {
                  const img = p.cover_image_url ?? p.images?.[0]?.image_url ?? LOGO_FALLBACK;
                  return (
                    <Link key={p.id} className="ind-tile ind-reveal" href="/proyectos">
                      <img src={img} alt={p.cover_image_alt ?? p.title} />
                      <div className="ind-meta">
                        <h4>{p.title}</h4>
                        <span>{p.category?.name ?? "Obra"}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* NOSOTROS */}
        {c.about && (
          <section id="nosotros" className="ind-block">
            <div className="ind-wrap ind-about">
              <div className="ind-frame ind-reveal">
                <div className="ind-photo" style={{ aspectRatio: "4 / 5" }}>
                  {c.about.primary_image_url && <img src={c.about.primary_image_url} alt={c.about.primary_image_alt ?? ""} />}
                </div>
              </div>
              <div className="ind-reveal">
                <span className="ind-label">{c.about.eyebrow ?? "Nosotros"}</span>
                <h2 className="ind-h2-mt" style={{ fontSize: "clamp(30px,4.6vw,60px)" }}>{c.about.title}</h2>
                {c.about.description && <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.7, marginTop: 18 }}>{c.about.description}</p>}
                {c.values.length > 0 && (
                  <div className="ind-values">
                    {c.values.map((v) => (<span className="ind-chip" key={v.id}>{v.name}</span>))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* DIFERENCIALES */}
        {c.differentiators.length > 0 && (
          <section className="ind-block" style={{ paddingTop: 0 }}>
            <div className="ind-wrap">
              <div className="ind-sec-head ind-reveal">
                <div>
                  <span className="ind-label">{sec("differentiators")?.eyebrow ?? "Por qué Pinceles"}</span>
                  <h2 className="ind-h2-mt">{sec("differentiators")?.title ?? "Trabajo serio, sin sorpresas"}</h2>
                </div>
              </div>
              <div className="ind-diff">
                {c.differentiators.map((d) => (
                  <div className="ind-diff-card ind-reveal" key={d.id}>
                    <h3>{d.title}</h3>
                    {d.description && <p>{d.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        {c.cta && (
          <section className="ind-block" style={{ paddingTop: 0 }}>
            <div className="ind-wrap ind-reveal">
              <div className="ind-hazard" />
              <div className="ind-cta-inner">
                <span className="ind-label" style={{ justifyContent: "center" }}>{c.cta.eyebrow ?? "Contacto"}</span>
                <h2 style={{ marginTop: 20 }}>{ctaBase} {c.cta.highlighted_text && <em>{c.cta.highlighted_text}</em>}</h2>
                {c.cta.description && <p>{c.cta.description}</p>}
                <a className="ind-btn ind-btn-primary" href={wa} target="_blank" rel="noopener" style={{ fontSize: 15, padding: "20px 34px" }}>
                  {c.cta.primary_button_text || "Pedir presupuesto por WhatsApp"} →
                </a>
              </div>
            </div>
          </section>
        )}

        {/* CONTACTO */}
        <section id="contacto" className="ind-block" style={{ paddingTop: 0 }}>
          <div className="ind-wrap ind-contact">
            <div className="ind-reveal">
              <span className="ind-label">{sec("contact")?.eyebrow ?? "Contacto"}</span>
              <h2 className="ind-h2-mt" style={{ fontSize: "clamp(30px,4.6vw,60px)" }}>{sec("contact")?.title ?? "Pedí tu presupuesto"}</h2>
              {sec("contact")?.description && <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.65, marginTop: 16 }}>{sec("contact")?.description}</p>}
              <div className="ind-info">
                <a href={wa} target="_blank" rel="noopener"><span className="ic"><WhatsAppIcon size={22} /></span><span><span className="lbl">WhatsApp</span><span className="val">{c.settings?.phone_display ?? ""}</span></span></a>
                {c.settings?.email && <a href={`mailto:${c.settings.email}`}><span className="ic"><Icon name="mail" size={22} /></span><span><span className="lbl">Correo</span><span className="val">{c.settings.email}</span></span></a>}
                {address && <a href={mapsUrl} target="_blank" rel="noopener"><span className="ic"><Icon name="map-pin" size={22} /></span><span><span className="lbl">Dirección</span><span className="val">{address}</span></span></a>}
                {c.settings?.coverage && <a href="#proyectos"><span className="ic"><Icon name="map-pin" size={22} /></span><span><span className="lbl">Cobertura</span><span className="val">{c.settings.coverage}</span></span></a>}
                {c.settings?.business_hours && <a href="#contacto"><span className="ic"><Icon name="clock" size={22} /></span><span><span className="lbl">Horario</span><span className="val">{c.settings.business_hours}</span></span></a>}
              </div>
            </div>
            <div className="ind-form-card ind-reveal">
              <ContactForm services={c.services} settings={c.settings} />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ind-footer">
          <div className="ind-wrap">
            <div className="ind-foot-grid">
              <div>
                <img className="ind-brand-logo" style={{ height: 66, marginBottom: 16 }} src={logo} alt="Pinceles" />
                {c.settings?.slogan && <p style={{ color: "var(--muted)", maxWidth: "34ch" }}>{c.settings.slogan}</p>}
              </div>
              <div>
                <h5>Navegación</h5>
                {nav.map((l) => (<a key={l.id} href={l.href}>{l.label}</a>))}
              </div>
              <div>
                <h5>Contacto</h5>
                <a href={wa} target="_blank" rel="noopener">WhatsApp {c.settings?.phone_display ?? ""}</a>
                {c.settings?.email && <a href={`mailto:${c.settings.email}`}>{c.settings.email}</a>}
                {address && <a href={mapsUrl} target="_blank" rel="noopener">{address}</a>}
                {c.settings?.coverage && <p style={{ color: "var(--muted)" }}>{c.settings.coverage}</p>}
              </div>
            </div>
            <div className="ind-foot-bottom">
              <span>© 2026 {c.settings?.company_name ?? "Pinceles"}</span>
              <span>Desarrollado por <a href="https://neura.com.py" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>NEURA</a></span>
            </div>
          </div>
        </footer>

        {/* WhatsApp flotante */}
        <a className="ind-wa" href={wa} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp"><WhatsAppIcon size={28} /></a>
      </div>
    </div>
  );
}
