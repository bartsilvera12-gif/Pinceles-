"use client";

import { useEffect, useState } from "react";
import { getPublicSiteContent, type PublicSiteContent } from "@/lib/data/get-public-site-content";
import { AdminGate } from "@/components/admin/spa/AdminGate";
import { HomeRedesign } from "@/components/site/HomeRedesign";

export default function HomePage() {
  // Sitio en VIVO: lee el contenido publicado desde Supabase en el navegador,
  // así los cambios del panel admin se reflejan sin reconstruir/re-subir.
  const [c, setC] = useState<PublicSiteContent | null>(null);

  useEffect(() => {
    const p = window.location.pathname.replace(/\/+$/, "");
    if (p === "/admin" || p.startsWith("/admin/")) return; // el panel tapa la home
    getPublicSiteContent().then(setC).catch(() => setC(null));
  }, []);

  return (
    <>
      {/* Panel admin (host-proof): si la URL es /admin/*, se renderiza sobre la home. */}
      <AdminGate />
      {c ? <HomeRedesign content={c} /> : <div id="pz-marketing" style={{ minHeight: "100vh", background: "#ffffff" }} />}
    </>
  );
}
