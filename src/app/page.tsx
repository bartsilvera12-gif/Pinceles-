import Image from "next/image";
import { getPublicSiteContent } from "@/lib/data/get-public-site-content";
import { Header } from "@/components/site/Header";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { ContactForm } from "@/components/site/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const OCRE = "#D9912F";
const wrap: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "0 clamp(18px,3vw,36px)" };
const eyebrow: React.CSSProperties = { margin: "0 0 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: OCRE };
const h2: React.CSSProperties = { margin: 0, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(32px,3.8vw,50px)", lineHeight: 1.1, letterSpacing: "-.02em" };

export default async function HomePage() {
  const c = await getPublicSiteContent();
  const wa = whatsappUrl(c.settings?.whatsapp_number, c.settings?.whatsapp_default_message);
  const sec = (k: string) => c.sections[k];

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "#050505", background: "#ffffff", overflowX: "hidden", maxWidth: "100vw" }}>
      <Header settings={c.settings} navigation={c.navigation} />

      {/* HERO */}
      {c.hero && (
        <section id="inicio" style={{ position: "relative", background: "#F8F6F1", padding: "clamp(110px,13vw,150px) 0 0" }}>
          <div style={{ ...wrap, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(28px,4vw,56px)" }}>
            <div style={{ flex: "1 1 420px", minWidth: 300, animation: "pincelIn .7s ease both" }}>
              {c.hero.eyebrow && <p style={eyebrow}>{c.hero.eyebrow}</p>}
              <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(40px,5.6vw,72px)", lineHeight: 1.04, letterSpacing: "-.02em" }}>
                {c.hero.title_before_highlight}
                <span style={{ position: "relative", display: "inline-block", color: OCRE }}>{c.hero.highlighted_text}</span>
                {c.hero.title_after_highlight}
              </h1>
              {c.hero.description && <p style={{ margin: "26px 0 0", maxWidth: "54ch", fontSize: "clamp(16px,1.15vw,18px)", lineHeight: 1.65, color: "#4D4D4E" }}>{c.hero.description}</p>}
              <div className="pz-cta-group" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34 }}>
                <a href={c.hero.primary_button_url ?? "#contacto"} className="pz-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: OCRE, color: "#050505", fontWeight: 700, fontSize: 16, padding: "17px 26px", borderRadius: 14, boxShadow: "0 8px 20px rgba(217,145,47,.28)" }}>
                  <Icon name="file-text" size={20} />
                  {c.hero.primary_button_text ?? "Solicitar presupuesto"}
                </a>
                <a href={wa} target="_blank" rel="noopener" className="pz-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(5,5,5,.2)", color: "#050505", fontWeight: 700, fontSize: 16, padding: "17px 26px", borderRadius: 14, background: "#ffffff" }}>
                  <span style={{ color: OCRE }}><WhatsAppIcon size={20} /></span>
                  {c.hero.secondary_button_text ?? "Contactar por WhatsApp"}
                </a>
              </div>
            </div>
            <div style={{ flex: "1 1 420px", minWidth: 300, position: "relative" }}>
              {c.hero.image_url && (
                <Image src={c.hero.image_url} alt={c.hero.image_alt ?? "Pinceles"} width={1280} height={720} priority style={{ position: "relative", width: "100%", height: "clamp(280px,42vw,480px)", objectFit: "cover", borderRadius: 22, boxShadow: "0 26px 60px rgba(5,5,5,.16)" }} />
              )}
              {c.hero.image_badge && (
                <div style={{ position: "relative", margin: "-34px 0 0 auto", width: "fit-content", background: "#ffffff", borderRadius: 16, padding: "14px 20px", boxShadow: "0 14px 34px rgba(5,5,5,.12)", fontSize: 14, fontWeight: 600 }}>{c.hero.image_badge}</div>
              )}
            </div>
          </div>

          {/* TRUST */}
          {c.trust.length > 0 && (
            <div style={{ ...wrap, margin: "clamp(34px,5vw,56px) auto 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", background: "#ffffff", border: "1px solid rgba(5,5,5,.07)", borderRadius: 18, overflow: "hidden", boxShadow: "0 12px 30px rgba(5,5,5,.05)" }}>
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
          <div style={{ height: "clamp(50px,7vw,90px)" }} />
        </section>
      )}

      {/* SERVICIOS */}
      {c.services.length > 0 && (
        <section id="servicios" style={{ padding: "clamp(64px,8vw,110px) 0", background: "#ffffff" }}>
          <div style={wrap}>
            <div style={{ maxWidth: 640 }}>
              <p style={eyebrow}>{sec("services")?.eyebrow ?? "Servicios"}</p>
              <h2 style={h2}>{sec("services")?.title ?? "Soluciones para cada proyecto"}</h2>
              {sec("services")?.description && <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.65, color: "#4D4D4E" }}>{sec("services")?.description}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20, marginTop: "clamp(34px,4vw,54px)" }}>
              {c.services.map((s) => (
                <article key={s.id} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 28, background: "#ffffff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 18 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: "rgba(217,145,47,.12)", color: OCRE }}>
                    <Icon name={s.icon} size={26} />
                  </span>
                  <h3 style={{ margin: "6px 0 0", fontSize: 19, fontWeight: 700 }}>{s.title}</h3>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#4D4D4E", flex: 1 }}>{s.short_description}</p>
                  <a href="#contacto" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#050505" }}>
                    Conocer más<Icon name="arrow-right" size={16} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NOSOTROS */}
      {c.about && (
        <section id="nosotros" style={{ padding: "clamp(64px,8vw,110px) 0", background: "#F8F6F1" }}>
          <div style={{ ...wrap, display: "flex", flexWrap: "wrap", gap: "clamp(30px,5vw,70px)", alignItems: "center" }}>
            <div style={{ flex: "1 1 380px", minWidth: 290, position: "relative" }}>
              {c.about.primary_image_url && <Image src={c.about.primary_image_url} alt={c.about.primary_image_alt ?? ""} width={1600} height={1066} style={{ width: "100%", height: "clamp(300px,40vw,470px)", objectFit: "cover", borderRadius: 22 }} />}
            </div>
            <div style={{ flex: "1 1 380px", minWidth: 290 }}>
              <p style={eyebrow}>{c.about.eyebrow ?? "Sobre nosotros"}</p>
              <h2 style={h2}>{c.about.title}</h2>
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
      )}

      {/* PROCESO */}
      {c.process.length > 0 && (
        <section style={{ padding: "clamp(64px,8vw,110px) 0", background: "#ffffff" }}>
          <div style={wrap}>
            <div style={{ maxWidth: 620 }}>
              <p style={eyebrow}>{sec("process")?.eyebrow ?? "Proceso"}</p>
              <h2 style={h2}>{sec("process")?.title ?? "Así trabajamos"}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 24, marginTop: "clamp(34px,4vw,54px)" }}>
              {c.process.map((p) => (
                <div key={p.id} style={{ paddingTop: 26, borderTop: "2px solid rgba(217,145,47,.35)" }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{p.title}</h3>
                  {p.description && <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: "#4D4D4E" }}>{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROYECTOS */}
      {c.projects.length > 0 && (
        <section id="proyectos" style={{ padding: "clamp(64px,8vw,110px) 0", background: "#F8F6F1" }}>
          <div style={wrap}>
            <div style={{ maxWidth: 560, marginBottom: 24 }}>
              <p style={eyebrow}>{sec("projects")?.eyebrow ?? "Proyectos"}</p>
              <h2 style={h2}>{sec("projects")?.title ?? "Trabajos realizados"}</h2>
              {sec("projects")?.description && <p style={{ margin: "16px 0 0", fontSize: 17, lineHeight: 1.65, color: "#4D4D4E" }}>{sec("projects")?.description}</p>}
            </div>
            <ProjectGallery projects={c.projects} categories={c.categories} />
          </div>
        </section>
      )}

      {/* INDUSTRIAS */}
      {c.industries.length > 0 && (
        <section id="industrias" style={{ padding: "clamp(64px,8vw,110px) 0", background: "#ffffff" }}>
          <div style={{ ...wrap, display: "flex", flexWrap: "wrap", gap: "clamp(30px,5vw,64px)" }}>
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <p style={eyebrow}>{sec("industries")?.eyebrow ?? "Industrias y clientes"}</p>
              <h2 style={h2}>{sec("industries")?.title ?? "A quiénes acompañamos"}</h2>
              {sec("industries")?.description && <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.65, color: "#4D4D4E" }}>{sec("industries")?.description}</p>}
            </div>
            <div style={{ flex: "1 1 420px", minWidth: 290 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, background: "rgba(5,5,5,.09)", border: "1px solid rgba(5,5,5,.09)", borderRadius: 18, overflow: "hidden" }}>
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
      )}

      {/* DIFERENCIALES */}
      {c.differentiators.length > 0 && (
        <section style={{ padding: "clamp(64px,8vw,110px) 0", background: "#F8F6F1" }}>
          <div style={wrap}>
            <div style={{ maxWidth: 620 }}>
              <p style={eyebrow}>{sec("differentiators")?.eyebrow ?? "Diferenciales"}</p>
              <h2 style={h2}>{sec("differentiators")?.title ?? "¿Por qué elegir Pinceles?"}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: "clamp(30px,4vw,50px)", borderTop: "1px solid rgba(5,5,5,.12)" }}>
              {c.differentiators.map((d) => (
                <div key={d.id} style={{ padding: "28px 24px 28px 0", borderBottom: "1px solid rgba(5,5,5,.12)" }}>
                  <span style={{ display: "block", fontSize: 17, fontWeight: 700 }}>{d.title}</span>
                  {d.description && <span style={{ display: "block", marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#4D4D4E" }}>{d.description}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section style={{ position: "relative", background: "#050505", color: "#ffffff", padding: "clamp(64px,8vw,108px) 0", overflow: "hidden" }}>
          <div style={{ ...wrap, position: "relative", display: "flex", flexWrap: "wrap", gap: "clamp(28px,5vw,60px)", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: "1 1 420px", minWidth: 290 }}>
              <h2 style={{ ...h2, fontSize: "clamp(32px,4.2vw,56px)" }}>
                {c.cta.title?.replace(c.cta.highlighted_text ?? "", "")}
                {c.cta.highlighted_text && <span style={{ color: OCRE }}>{c.cta.highlighted_text}</span>}
              </h2>
              {c.cta.description && <p style={{ margin: "22px 0 0", maxWidth: "52ch", fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,.74)" }}>{c.cta.description}</p>}
            </div>
            <div className="pz-cta-group" style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <a href={c.cta.primary_button_url ?? "#contacto"} className="pz-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: OCRE, color: "#050505", fontWeight: 700, fontSize: 16, padding: "18px 28px", borderRadius: 14 }}>
                <Icon name="file-text" size={20} />
                {c.cta.primary_button_text ?? "Solicitar presupuesto"}
              </a>
              <a href={wa} target="_blank" rel="noopener" className="pz-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,.3)", color: "#ffffff", fontWeight: 700, fontSize: 16, padding: "18px 28px", borderRadius: 14 }}>
                <WhatsAppIcon size={20} />
                {c.cta.secondary_button_text ?? "Hablar por WhatsApp"}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: "clamp(64px,8vw,110px) 0", background: "#ffffff" }}>
        <div style={{ ...wrap, display: "flex", flexWrap: "wrap", gap: "clamp(30px,5vw,64px)" }}>
          <div style={{ flex: "1 1 330px", minWidth: 280 }}>
            <p style={eyebrow}>{sec("contact")?.eyebrow ?? "Contacto"}</p>
            <h2 style={h2}>{sec("contact")?.title ?? "Pedí tu presupuesto"}</h2>
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
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        aria-label="Escribinos por WhatsApp"
        style={{ position: "fixed", right: "clamp(14px,2.4vw,28px)", bottom: "clamp(14px,2.4vw,28px)", zIndex: 100, display: "flex", alignItems: "center", gap: 10, background: "#050505", color: "#ffffff", borderRadius: 999, padding: "14px 18px", boxShadow: "0 14px 30px rgba(5,5,5,.28)", fontSize: 14, fontWeight: 700 }}
      >
        <WhatsAppIcon size={22} />
        <span>Escribinos</span>
      </a>
    </div>
  );
}

function ContactInfo({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, color: "#050505" }}>
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
