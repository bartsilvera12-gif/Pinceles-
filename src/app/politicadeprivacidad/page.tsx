import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

// Página oculta: solo accesible por esta URL, no indexable y sin enlaces en el sitio.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Política de privacidad | Pinceles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LegalPage slug="privacidad" />;
}
