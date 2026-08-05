import { LegalPage } from "@/components/site/LegalPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Política de privacidad | Pinceles" };

export default function Page() {
  return <LegalPage slug="privacidad" />;
}
