"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { PendingNotice } from "@/components/admin/spa/PendingNotice";

export default function MultimediaAdminPage() {
  return (
    <SpaPage title="Multimedia" subtitle="Biblioteca de imágenes.">
      <PendingNotice reason="La subida de imágenes desde el navegador se hace directo a Supabase Storage y requiere configurar las políticas del bucket. Es la próxima fase. Por ahora, en los campos de imagen podés pegar la URL de una imagen ya subida." />
    </SpaPage>
  );
}
