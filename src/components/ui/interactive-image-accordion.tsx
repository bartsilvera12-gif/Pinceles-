"use client";

import React, { useState } from "react";

// Acordeón de imágenes interactivo. Adaptado de un componente de 21st.dev:
// tipado, activación por hover/foco/clic (para móvil) y estilos Tailwind v4.

export type AccordionImageItem = {
  id: string | number;
  title: string;
  imageUrl: string;
  imageAlt?: string;
};

const FALLBACK =
  "https://placehold.co/400x450/2d3748/ffffff?text=Pinceles";

function AccordionItem({
  item,
  isActive,
  onActivate,
}: {
  item: AccordionImageItem;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={item.title}
      aria-expanded={isActive}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className={`
        relative h-[380px] md:h-[450px] shrink-0 rounded-2xl overflow-hidden cursor-pointer
        outline-none focus-visible:ring-2 focus-visible:ring-[#d9912f]
        transition-all duration-700 ease-in-out
        ${isActive ? "w-[320px] md:w-[400px]" : "w-[60px]"}
      `}
    >
      {/* Imagen de fondo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.imageAlt ?? item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const img = e.currentTarget;
          img.onerror = null;
          img.src = FALLBACK;
        }}
      />
      {/* Velo oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Título */}
      <span
        className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0"
              : "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90"
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
}

export function ImageAccordion({
  items,
  defaultActiveIndex = 0,
}: {
  items: AccordionImageItem[];
  /** Índice que arranca expandido (por defecto el primero). */
  defaultActiveIndex?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-row items-center justify-center gap-3 md:gap-4 overflow-x-auto p-1 md:p-4">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onActivate={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
