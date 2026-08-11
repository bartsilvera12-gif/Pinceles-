"use client";

import { useEffect } from "react";

// Añade la clase .pz-reveal-in a los elementos .pz-reveal cuando entran en
// pantalla, para dispararles la animación de "deslizamiento" (slide-in).
export function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".pz-reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("pz-reveal-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pz-reveal-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return null;
}
