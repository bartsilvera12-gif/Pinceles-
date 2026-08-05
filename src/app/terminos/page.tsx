import { LegalPage } from "@/components/site/LegalPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Términos y condiciones | Pinceles" };

export default function Page() {
  return <LegalPage slug="terminos" />;
}
