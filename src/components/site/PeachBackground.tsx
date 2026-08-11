// Fondo de la página: imagen peach fluida (public/images/fondo.jpg).
// Wallpaper fijo, tipo "cover", detrás de todas las secciones claras.
// Único fondo (sin degradados CSS encima) => no se superpone con nada.

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
        backgroundImage: "url('/images/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}
