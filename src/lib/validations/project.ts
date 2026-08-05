import { z } from "zod";

export const projectImageSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1, "Falta la imagen."),
  altText: z.string().max(300).optional().or(z.literal("")),
  caption: z.string().max(300).optional().or(z.literal("")),
  isCover: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "El título es obligatorio.").max(200),
  slug: z
    .string()
    .trim()
    .min(2, "El slug es obligatorio.")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones."),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  shortDescription: z.string().max(500).optional().or(z.literal("")),
  fullDescription: z.string().max(5000).optional().or(z.literal("")),
  clientName: z.string().max(200).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  completionDate: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().max(300).optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  coverImageAlt: z.string().max(300).optional().or(z.literal("")),
  images: z.array(projectImageSchema).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectFormValues = z.input<typeof projectSchema>;
export type ProjectImageInput = z.infer<typeof projectImageSchema>;
