"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { whatsappUrl } from "@/lib/utils";
import type { Service, SiteSettings } from "@/types/database.types";

export function ContactForm({
  services,
  settings,
}: {
  services: Service[];
  settings: SiteSettings | null;
}) {
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactInput) => {
    const serviceName = services.find((s) => s.id === values.serviceId)?.title ?? values.serviceName ?? "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, serviceName }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus({ msg: json.error ?? "No pudimos registrar la solicitud.", ok: false });
        return;
      }
      const lines = [
        settings?.whatsapp_default_message ?? "Hola, quisiera solicitar un presupuesto.",
        `Nombre: ${values.name}`,
        values.company ? `Empresa: ${values.company}` : "",
        `Teléfono: ${values.phone}`,
        values.email ? `Correo: ${values.email}` : "",
        serviceName ? `Servicio: ${serviceName}` : "",
        values.location ? `Ubicación: ${values.location}` : "",
        values.message ? `Detalle: ${values.message}` : "",
      ].filter(Boolean);
      window.open(whatsappUrl(settings?.whatsapp_number, lines.join("\n")), "_blank", "noopener");
      setStatus({ msg: "Abrimos WhatsApp con tu solicitud. ¡Gracias!", ok: true });
    } catch {
      setStatus({ msg: "Error de red. Escribinos por WhatsApp.", ok: false });
    }
  };

  const field: React.CSSProperties = {
    width: "100%",
    minHeight: 50,
    padding: "13px 15px",
    borderRadius: 12,
    border: "1px solid rgba(5,5,5,.14)",
    background: "#ffffff",
    color: "#050505",
  };
  const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 7 };
  const err: React.CSSProperties = { display: "block", marginTop: 6, fontSize: 12, fontWeight: 600, color: "#b23b2f" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
      {/* Honeypot oculto */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden {...register("website")} style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />

      <label style={{ gridColumn: "1 / -1" }}>
        <span style={label}>Nombre *</span>
        <input {...register("name")} placeholder="Tu nombre y apellido" style={field} aria-invalid={!!errors.name} />
        {errors.name && <span style={err}>{errors.name.message}</span>}
      </label>

      <label>
        <span style={label}>Empresa</span>
        <input {...register("company")} placeholder="Opcional" style={field} />
      </label>

      <label>
        <span style={label}>Teléfono *</span>
        <input {...register("phone")} placeholder="09XX XXX XXX" style={field} aria-invalid={!!errors.phone} />
        {errors.phone && <span style={err}>{errors.phone.message}</span>}
      </label>

      <label>
        <span style={label}>Correo</span>
        <input {...register("email")} placeholder="nombre@correo.com" style={field} aria-invalid={!!errors.email} />
        {errors.email && <span style={err}>{errors.email.message}</span>}
      </label>

      <label>
        <span style={label}>Ubicación</span>
        <input {...register("location")} placeholder="Ciudad o barrio" style={field} />
      </label>

      <label style={{ gridColumn: "1 / -1" }}>
        <span style={label}>Tipo de servicio</span>
        <select {...register("serviceId")} style={field} defaultValue="">
          <option value="">Seleccioná un servicio</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </label>

      <label style={{ gridColumn: "1 / -1" }}>
        <span style={label}>Mensaje</span>
        <textarea {...register("message")} rows={4} placeholder="Contanos qué necesitás: superficie, ubicación, plazos." style={{ ...field, resize: "vertical" }} />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          gridColumn: "1 / -1",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          minHeight: 56,
          background: "#D9912F",
          color: "#050505",
          fontWeight: 700,
          fontSize: 16,
          border: "none",
          borderRadius: 14,
          cursor: isSubmitting ? "wait" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        <WhatsAppIcon size={20} />
        {isSubmitting ? "Enviando…" : "Enviar solicitud por WhatsApp"}
      </button>

      {status && (
        <p aria-live="polite" style={{ gridColumn: "1 / -1", margin: 0, fontSize: 14, fontWeight: 600, color: status.ok ? "#4D4D4E" : "#b23b2f" }}>
          {status.msg}
        </p>
      )}
      <input type="hidden" {...register("serviceName")} />
    </form>
  );
}
