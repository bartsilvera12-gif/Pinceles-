/** Construye una URL de WhatsApp con mensaje opcional. */
export function whatsappUrl(number: string | null | undefined, message?: string | null): string {
  const n = (number ?? "").replace(/\D/g, "");
  const base = `https://wa.me/${n}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Genera un slug a partir de un texto. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
