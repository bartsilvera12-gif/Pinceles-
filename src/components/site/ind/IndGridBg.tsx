"use client";

import { useEffect, useRef } from "react";

// Fondo de grilla técnica animado (canvas) para las páginas con estilo industrial.
export function IndGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0, w = 0, h = 0, t = 0;
    const GAP = 46;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(5,5,5,.07)"; ctx.lineWidth = 1;
      const off = (t * 0.25) % GAP;
      for (let x = -off; x < w; x += GAP) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = -off; y < h; y += GAP) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      const nx = (Math.sin(t / 90) * 0.5 + 0.5) * w, ny = (Math.cos(t / 70) * 0.5 + 0.5) * h;
      const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, 260);
      g.addColorStop(0, "rgba(217,145,47,.16)"); g.addColorStop(1, "rgba(217,145,47,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      t += 1; raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas className="ind-grid-bg" ref={canvasRef} aria-hidden />;
}
