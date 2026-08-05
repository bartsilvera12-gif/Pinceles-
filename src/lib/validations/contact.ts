import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ingresá tu nombre.").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(6, "Ingresá un teléfono de contacto.")
    .max(40)
    .refine((v) => v.replace(/\D/g, "").length >= 7, "El teléfono parece incompleto."),
  email: z.string().trim().email("Revisá el correo.").max(160).optional().or(z.literal("")),
  serviceId: z.string().uuid().optional().or(z.literal("")),
  serviceName: z.string().trim().max(160).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot: debe venir vacío.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
