// Fondo de la página: imagen peach fluida (public/images/fondo.jpg).
// NO fijo: se posiciona absoluto cubriendo todo el alto de la página, así
// se mueve/recorre junto con el scroll (la imagen se ve de arriba a abajo).
// Único fondo (sin degradados CSS encima) => no se superpone con nada.

export function PeachBackground({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        backgroundImage: "url('/images/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}
