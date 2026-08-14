"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaMediaLibrary } from "@/components/admin/spa/SpaMediaLibrary";

export default function MultimediaAdminPage() {
  return (
    <SpaPage title="Multimedia" subtitle="Subí imágenes y copiá su URL para usarlas en el contenido.">
      <SpaMediaLibrary />
    </SpaPage>
  );
}
