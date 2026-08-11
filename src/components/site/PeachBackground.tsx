// Fondo "peach fluido" con CSS puro (réplica de la imagen de referencia).
// Se usa como wallpaper detrás de todas las secciones claras. 0 KB, responsive,
// se ve igual en local, Vercel y Hostinger. Sin animación (estático como la imagen).

const PEACH = `
  radial-gradient(60% 55% at 22% 18%, #FBD6AE 0%, rgba(251,214,174,0) 60%),
  radial-gradient(52% 50% at 82% 12%, #F7C695 0%, rgba(247,198,149,0) 55%),
  radial-gradient(55% 62% at 72% 68%, #FCE1C2 0%, rgba(252,225,194,0) 62%),
  radial-gradient(48% 52% at 16% 82%, #F5BE88 0%, rgba(245,190,136,0) 58%),
  radial-gradient(42% 46% at 50% 48%, #FDF0DD 0%, rgba(253,240,221,0) 62%),
  radial-gradient(40% 40% at 90% 88%, #F8CDA0 0%, rgba(248,205,160,0) 55%),
  linear-gradient(135deg, #FCEAD6 0%, #F9D9B7 55%, #F6CDA0 100%)
`;

export function PeachBackground({
  fixed = true,
  style,
}: {
  fixed?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: fixed ? "fixed" : "absolute",
        inset: 0,
        zIndex: fixed ? -1 : 0,
        pointerEvents: "none",
        background: PEACH,
        ...style,
      }}
    />
  );
}
