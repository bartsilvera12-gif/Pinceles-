"use client";

import { useEffect, useState } from "react";
import { HomeRedesign } from "./HomeRedesign";
import { getPublicSiteContentClient } from "@/lib/data/get-public-site-content.client";
import type { PublicSiteContent } from "@/lib/data/get-public-site-content";

/**
 * Renderiza la home con el contenido del build (carga rápida + SEO) y, al montar,
 * lo refresca con lo último de Supabase. Así los cambios del panel se ven EN VIVO
 * sin rebuild — incluso en el export estático de Hostinger.
 */
export function HomeLive({ initialContent }: { initialContent: PublicSiteContent }) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    let alive = true;
    getPublicSiteContentClient()
      .then((fresh) => { if (alive) setContent(fresh); })
      .catch(() => { /* si falla, se queda con el contenido del build */ });
    return () => { alive = false; };
  }, []);

  return <HomeRedesign content={content} />;
}
