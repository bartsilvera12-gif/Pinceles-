"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicSiteContent } from "@/lib/data/get-public-site-content";
import { Header } from "@/components/site/Header";
import { PeachBackground } from "@/components/site/PeachBackground";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ImageAccordion } from "@/components/ui/interactive-image-accordion";
import { ContactForm } from "@/components/site/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappUrl } from "@/lib/utils";
import Aurora from "@/components/Aurora";
import BlurText from "@/components/BlurText";
import GradientText from "@/components/GradientText";
import ShinyText from "@/components/ShinyText";
import SpotlightCard from "@/components/SpotlightCard";

const OCRE = "#D9912F";
const SPOT = "rgba(217, 145, 47, 0.18)" as const;
const wrap: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "0 clamp(18px,3vw,36px)" };
const eyebrow: React.CSSProperties = { display: "inline-block", margin: "0 0 14px", padding: "6px 14px", background: "#ffffff", borderRadius: 999, boxShadow: "0 4px 14px rgba(5,5,5,.06)", fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: OCRE };
const divider: React.CSSProperties = { height: 5, background: "linear-gradient(90deg, transparent, rgba(217,145,47,.85) 8%, rgba(217,145,47,.85) 92%, transparent)", boxShadow: "0 1px 10px rgba(217,145,47,.35)" };

export function HomeRedesign({ content: c }: { content: PublicSiteContent }) {
  const wa = whatsappUrl(c.settings?.whatsapp_number, c.settings?.whatsapp_default_message);
  const sec = (k: string) => c.sections[k];

  // Ocultar por código el proyecto "torre residencial" (proj-torre) — no debe mostrarse.
  const hideProject = (p: (typeof c.projects)[number]) => {
    const s = [p.title, p.cover_image_url, p.cover_image_alt, ...(p.images?.map((i) => i.image_url) ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return s.includes("proj-torre") || s.includes("torre residencial");
  };
  const projects = c.projects.filter((p) => !hideProject(p));

  return (
    <div style={{ position: "relative", zIndex: 0, isolation: "isolate", fontFamily: "var(--font-sans)", color: "#050505", background: "transparent", overflowX: "hidden", maxWidth: "100vw" }}>
      <PeachBackground />
      <ScrollReveal />
      <Header settings={c.settings} navigation={c.navigation} />

      {/* HERO */}
      {c.hero && (
        <section id="inicio" style={{ position: "relative", background: "transparent", padding: "clamp(110px,13vw,150px) 0 0", overflow: "hidden" }}>
          {/* Fondo Aurora sutil en tonos ocre/peach */}
          <div className="pz-aurora" style={{ opacity: 0.55, maskImage: "linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)" }}>
            <Aurora colorStops={["#F6D9A8", "#D9912F", "#F1B24A"]} amplitude={0.9} blend={0.6} speed={0.6} />
          </div>

          <div style={{ ...wrap, position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(28px,4vw,56px)" }}>
            <div style={{ flex: "1 1 420px", minWidth: 300, animation: "pincelIn .7s ease both" }}>
              {c.hero.eyebrow && (
                <p style={eyebrow}>
                  <ShinyText text={c.hero.eyebrow} color={OCRE} shineColor="#FBEAD0" speed={4} spread={90} />
                </p>
              )}
              <h1 className="pz-anim-h1" style={{ display: "block" }}>
                {c.hero.title_before_highlight}
                <span style={{ position: "relative", display: "inline-block", color: OCRE }}>{c.hero.highlighted_text}</span>
                {c.hero.title_after_highlight}
              </h1>
              {c.hero.description && <p style={{ margin: "26px 0 0", maxWidth: "54ch", fontSize: "clamp(16px,1.15vw,18px)", lineHeight: 1.65, color: "#4D4D4E" }}>{c.hero.description}</p>}
            </div>
            <div style={{ flex: "1 1 420px", minWidth: 300, position: "relative" }}>
              {c.hero.image_url && (
                <Image src={c.hero.image_url} alt={c.hero.image_alt ?? "Pinceles"} width={1280} height={720} priority style={{ position: "relative", width: "100%", height: "clamp(280px,42vw,480px)", objectFit: "cover", borderRadius: 22, boxShadow: "0 26px 60px rgba(5,5,5,.16)" }} />
              )}
            </div>
          </div>

          {/* TRUST */}
          {c.trust.length > 0 && (
            <div style={{ ...wrap, position: "relative", zIndex: 1, margin: "clamp(34px,5vw,56px) auto 0" }}>
              <div className="pz-reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", background: "#ffffff", border: "1px solid rgba(5,5,5,.07)", borderRadius: 18, overflow: "hidden", boxShadow: "0 12px 30px rgba(5,5,5,.05)" }}>
                {c.trust.map((t) => (
                  <div key={t.id} className="pz-trust-cell" style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 24px" }}>
                    <span style={{ color: OCRE, flexShrink: 0 }}><Icon name={t.icon} size={26} /></span>
                    <span>
                      <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>{t.title}</span>
                      {t.subtitle && <span style={{ display: "block", fontSize: 13, color: "#4D4D4E" }}>{t.subtitle}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ ...divider, margin: "clamp(30px,4vw,46px) 0 0" }} aria-hidden />
        </section>
      )}

      {/* SERVICIOS */}
      {c.services.length > 0 && (
        <section id="servicios" style={{ padding: "clamp(30px,4vw,52px) 0 clamp(64px,8vw,110px)", background: "transparent" }}>
          <div style={wrap}>
            <div style={{ maxWidth: 640 }}>
              <p style={eyebrow}>{sec("services")?.eyebrow ?? "Servicios"}</p>
              <BlurText text={sec("services")?.title ?? "Soluciones para cada proyecto"} animateBy="words" delay={110} className="pz-anim-h2" />
              {sec("services")?.description && <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.65, color: "#4D4D4E" }}>{sec("services")?.description}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20, marginTop: "clamp(34px,4vw,54px)" }}>
              {c.services.map((s, i) => (
                <div key={s.id} className="pz-reveal" style={{ display: "flex", animationDelay: `${i * 0.09}s` }}>
                  <SpotlightCard className="pz-spot" spotlightColor={SPOT}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: "rgba(217,145,47,.12)", color: OCRE }}>
                        <Icon name={s.icon} size={26} />
                      </span>
                      <h3 style={{ margin: "6px 0 0", fontSize: 19, fontWeight: 700 }}>{s.title}</h3>
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#4D4D4E", flex: 1 }}>{s.short_description}</p>
                      <a href="#contacto" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#050505", background: OCRE, padding: "11px 18px", borderRadius: 12, alignSelf: "flex-start", boxShadow: "0 6px 16px rgba(217,145,47,.28)" }}>
                        Conocer más<span className="pz-card-arrow" style={{ display: "inline-flex" }}><Icon name="arrow-right" size={16} /></span>
                      </a>
                    </div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NOSOTROS */}
      {c.about && (
        <>
          <div style={divider} aria-hidden />
          <section id="nosotros" style={{ position: "relative", overflow: "hidden", padding: "clamp(64px,8vw,110px) 0", background: "transparent" }}>
            <div style={{ ...wrap, position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", gap: "clamp(30px,5vw,70px)", alignItems: "center" }}>
              <div style={{ flex: "1 1 380px", minWidth: 290, position: "relative" }}>
                {c.about.primary_image_url && <Image src={c.about.primary_image_url} alt={c.about.primary_image_alt ?? ""} width={1600} height={1066} style={{ width: "100%", height: "clamp(300px,40vw,470px)", objectFit: "cover", borderRadius: 22 }} />}
              </div>
              <div style={{ flex: "1 1 380px", minWidth: 290 }}>
                <p style={eyebrow}>{c.about.eyebrow ?? "Sobre nosotros"}</p>
                <BlurText text={c.about.title ?? ""} animateBy="words" delay={110} className="pz-anim-h2" />
                {c.about.description && <p style={{ margin: "20px 0 0", fontSize: 17, lineHeight: 1.7, color: "#4D4D4E" }}>{c.about.description}</p>}
                {c.values.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
                    {c.values.map((v) => (
                      <span key={v.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "#ffffff", border: "1px solid rgba(5,5,5,.07)", borderRadius: 999, fontSize: 14, fontWeight: 600 }}>
                        <span style={{ color: OCRE }}><Icon name="check" size={15} /></span>
                        {v.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* PROCESO */}
      {c.process.length > 0 && (
        <>
          <div style={divider} aria-hidden />
          <section style={{ padding: "clamp(64px,8vw,110px) 0", background: "transparent" }}>
            <div style={wrap}>
              <div style={{ maxWidth: 620 }}>
                <p style={eyebrow}>{sec("process")?.eyebrow ?? "Proceso"}</p>
                <BlurText text={sec("process")?.title ?? "Así trabajamos"} animateBy="words" delay={110} className="pz-anim-h2" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 24, marginTop: "clamp(34px,4vw,54px)" }}>
                {c.process.map((p, i) => (
                  <div key={p.id} className="pz-reveal" style={{ display: "flex", animationDelay: `${i * 0.09}s` }}>
                    <SpotlightCard className="pz-spot pz-spot-accent" spotlightColor={SPOT}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{p.title}</h3>
                      {p.description && <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: "#4D4D4E" }}>{p.description}</p>}
                    </SpotlightCard>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* PROYECTOS */}
      {projects.length > 0 && (
        <>
          <div style={divider} aria-hidden />
          <section id="proyectos" style={{ position: "relative", overflow: "hidden", padding: "clamp(64px,8vw,110px) 0", background: "transparent" }}>
            <div style={{ ...wrap, position: "relative", zIndex: 1 }}>
              <div style={{ maxWidth: 560, marginBottom: 24 }}>
                <p style={eyebrow}>{sec("projects")?.eyebrow ?? "Proyectos"}</p>
                <BlurText text={sec("projects")?.title ?? "Trabajos realizados"} animateBy="words" delay={110} className="pz-anim-h2" />
                {sec("projects")?.description && <p style={{ margin: "16px 0 0", fontSize: 17, lineHeight: 1.65, color: "#4D4D4E" }}>{sec("projects")?.description}</p>}
              </div>
              <ImageAccordion
                items={projects.slice(0, 6).map((p) => ({
                  id: p.id,
                  title: p.title,
                  imageUrl: p.cover_image_url ?? p.images?.[0]?.image_url ?? "/images/logo-pinceles.jpg",
                  imageAlt: p.cover_image_alt ?? p.title,
                }))}
                defaultActiveIndex={Math.min(projects.length, 6) - 1}
              />
              <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(28px,4vw,44px)" }}>
                <Link href="/proyectos" className="pz-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#050505", color: "#ffffff", fontWeight: 700, fontSize: 16, padding: "16px 26px", borderRadius: 14 }}>
                  Ver todos los proyectos
                  <Icon name="arrow-right" size={20} />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* INDUSTRIAS */}
      {c.industries.length > 0 && (
        <>
          <div style={divider} aria-hidden />
          <section id="industrias" style={{ padding: "clamp(64px,8vw,110px) 0", background: "transparent" }}>
            <div style={{ ...wrap, display: "flex", flexWrap: "wrap", gap: "clamp(30px,5vw,64px)" }}>
              <div style={{ flex: "1 1 320px", minWidth: 280 }}>
                <p style={eyebrow}>{sec("industries")?.eyebrow ?? "Industrias y clientes"}</p>
                <BlurText text={sec("industries")?.title ?? "A quiénes acompañamos"} animateBy="words" delay={110} className="pz-anim-h2" />
                {sec("industries")?.description && <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.65, color: "#4D4D4E" }}>{sec("industries")?.description}</p>}
              </div>
              <div style={{ flex: "1 1 420px", minWidth: 290 }}>
                <div className="pz-reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, background: "rgba(5,5,5,.09)", border: "1px solid rgba(5,5,5,.09)", borderRadius: 18, overflow: "hidden" }}>
                  {c.industries.map((i) => (
                    <div key={i.id} style={{ background: "#ffffff", padding: "26px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                      <span style={{ color: OCRE }}><Icon name={i.icon} size={24} /></span>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{i.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* DIFERENCIALES */}
      {c.differentiators.length > 0 && (
        <>
          <div style={divider} aria-hidden />
          <section style={{ position: "relative", overflow: "hidden", padding: "clamp(64px,8vw,110px) 0", background: "transparent" }}>
            <div style={{ ...wrap, position: "relative", zIndex: 1 }}>
              <div style={{ maxWidth: 620 }}>
                <p style={eyebrow}>{sec("differentiators")?.eyebrow ?? "Diferenciales"}</p>
                <BlurText text={sec("differentiators")?.title ?? "¿Por qué elegir Pinceles?"} animateBy="words" delay={110} className="pz-anim-h2" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: "clamp(30px,4vw,50px)" }}>
                {c.differentiators.map((d, i) => (
                  <div key={d.id} className="pz-reveal" style={{ display: "flex", animationDelay: `${i * 0.07}s` }}>
                    <SpotlightCard className="pz-spot pz-spot-accent" spotlightColor={SPOT}>
                      <span style={{ display: "block", fontSize: 17, fontWeight: 700 }}>{d.title}</span>
                      {d.description && <span style={{ display: "block", marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#4D4D4E" }}>{d.description}</span>}
                    </SpotlightCard>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      {c.cta && (
        <section style={{ position: "relative", background: "#050505", color: "#ffffff", padding: "clamp(64px,8vw,108px) 0", overflow: "hidden" }}>
          {/* Aurora luce en fondo oscuro */}
          <div className="pz-aurora" style={{ opacity: 0.7 }}>
            <Aurora colorStops={["#D9912F", "#F1B24A", "#DEB97F"]} amplitude={1.0} blend={0.5} speed={0.7} />
          </div>
          <div style={{ ...wrap, position: "relative", zIndex: 1, textAlign: "center" }}>
            <GradientText colors={["#DEB97F", "#F1B24A", "#D9912F", "#DEB97F"]} animationSpeed={7} className="pz-anim-h2 pz-center" >
              {c.cta.title}
            </GradientText>
            {c.cta.description && <p style={{ margin: "22px auto 0", maxWidth: "56ch", fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,.74)" }}>{c.cta.description}</p>}
          </div>
        </section>
      )}

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: "clamp(64px,8vw,110px) 0", background: "transparent" }}>
        <div style={{ ...wrap, display: "flex", flexWrap: "wrap", gap: "clamp(30px,5vw,64px)" }}>
          <div style={{ flex: "1 1 330px", minWidth: 280 }}>
            <p style={eyebrow}>{sec("contact")?.eyebrow ?? "Contacto"}</p>
            <BlurText text={sec("contact")?.title ?? "Pedí tu presupuesto"} animateBy="words" delay={110} className="pz-anim-h2" />
            {sec("contact")?.description && <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.65, color: "#4D4D4E" }}>{sec("contact")?.description}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 30 }}>
              <ContactInfo icon={<WhatsAppIcon size={22} />} label="WhatsApp" value={c.settings?.phone_display ?? ""} href={wa} />
              {c.settings?.email && <ContactInfo icon={<Icon name="mail" size={22} />} label="Correo" value={c.settings.email} href={`mailto:${c.settings.email}`} />}
              {c.settings?.coverage && <ContactInfo icon={<Icon name="map-pin" size={22} />} label="Cobertura" value={c.settings.coverage} href="#proyectos" />}
              {c.settings?.business_hours && <ContactInfo icon={<Icon name="clock" size={22} />} label="Horario de atención" value={c.settings.business_hours} href="#contacto" />}
            </div>
          </div>
          <div style={{ flex: "1 1 420px", minWidth: 290, background: "#F8F6F1", borderRadius: 22, padding: "clamp(22px,3vw,38px)" }}>
            <ContactForm services={c.services} settings={c.settings} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#050505", color: "rgba(255,255,255,.72)", padding: "clamp(50px,6vw,80px) 0 30px" }}>
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 36 }}>
          <div>
            {c.settings?.logo_url && <Image src={c.settings.logo_url} alt="Pinceles" width={180} height={153} style={{ width: 168, height: "auto", borderRadius: 10, background: "#ffffff" }} />}
            {c.settings?.slogan && <p style={{ margin: "18px 0 0", fontFamily: "var(--font-display)", fontSize: 17, color: "#DEB97F" }}>{c.settings.slogan}</p>}
          </div>
          <div>
            <h3 style={footerH}>Navegación</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {c.navigation.map((l) => (
                <a key={l.id} href={l.href} style={footerLink}>{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h3 style={footerH}>Contacto</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 15 }}>
              <a href={wa} target="_blank" rel="noopener" style={footerLink}>WhatsApp {c.settings?.phone_display ?? ""}</a>
              {c.settings?.email && <a href={`mailto:${c.settings.email}`} style={footerLink}>{c.settings.email}</a>}
              {c.settings?.coverage && <span>{c.settings.coverage}</span>}
              {c.settings?.business_hours && <span>{c.settings.business_hours}</span>}
            </div>
          </div>
        </div>
        <div style={{ ...wrap, marginTop: "clamp(34px,4vw,54px)", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>
            Desarrollado por{" "}
            <a href="https://neura.com.py" target="_blank" rel="noopener" style={{ color: OCRE, fontWeight: 700 }}>NEURA</a>
          </span>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      <a href={wa} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp" style={{ position: "fixed", right: "clamp(14px,2.4vw,28px)", bottom: "clamp(14px,2.4vw,28px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", width: 58, height: 58, background: "#050505", color: "#ffffff", borderRadius: 999, boxShadow: "0 14px 30px rgba(5,5,5,.28)" }}>
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}

function ContactInfo({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="pz-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "#ffffff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, boxShadow: "0 8px 22px rgba(5,5,5,.06)", color: "#050505" }}>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "rgba(217,145,47,.12)", flexShrink: 0, color: OCRE }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#4D4D4E" }}>{label}</span>
        <span style={{ display: "block", marginTop: 3, fontSize: 16, fontWeight: 600 }}>{value}</span>
      </span>
    </a>
  );
}

const footerH: React.CSSProperties = { margin: "0 0 16px", fontSize: 13, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#ffffff" };
const footerLink: React.CSSProperties = { fontSize: 15, color: "rgba(255,255,255,.72)" };
