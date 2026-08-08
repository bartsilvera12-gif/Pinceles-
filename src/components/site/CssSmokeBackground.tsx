// Fondo animado "humo" con CSS puro (sin WebGL). Blobs de color desenfocados
// que se desplazan suavemente = efecto de humo/flujo. Colores de la paleta del
// prompt (#031C26, #1B6CA8, #5AD2F4, #EAF9FF). Se ve en cualquier navegador.

export function CssSmokeBackground({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "linear-gradient(135deg, #EAF9FF 0%, #CDEBFA 100%)",
        ...style,
      }}
    >
      <span className="pz-smoke pz-smoke-a" />
      <span className="pz-smoke pz-smoke-b" />
      <span className="pz-smoke pz-smoke-c" />
      <span className="pz-smoke pz-smoke-d" />
      <style>{`
        .pz-smoke { position:absolute; border-radius:50%; filter:blur(70px); will-change:transform; pointer-events:none; }
        .pz-smoke-a { width:55vw; height:55vw; left:-8%; top:-25%; background:radial-gradient(circle at 50% 50%, rgba(90,210,244,.85), rgba(90,210,244,0) 65%); animation:pzsA 24s ease-in-out infinite; }
        .pz-smoke-b { width:48vw; height:48vw; right:-6%; top:0%; background:radial-gradient(circle at 50% 50%, rgba(27,108,168,.75), rgba(27,108,168,0) 65%); animation:pzsB 30s ease-in-out infinite; }
        .pz-smoke-c { width:44vw; height:44vw; left:16%; bottom:-30%; background:radial-gradient(circle at 50% 50%, rgba(3,28,38,.42), rgba(3,28,38,0) 60%); animation:pzsC 36s ease-in-out infinite; }
        .pz-smoke-d { width:40vw; height:40vw; right:14%; bottom:-18%; background:radial-gradient(circle at 50% 50%, rgba(147,216,240,.9), rgba(147,216,240,0) 65%); animation:pzsD 28s ease-in-out infinite; }
        @keyframes pzsA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18%,14%) scale(1.18)} }
        @keyframes pzsB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-16%,18%) scale(1.12)} }
        @keyframes pzsC { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(12%,-16%) scale(1.22)} }
        @keyframes pzsD { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14%,-10%) scale(1.15)} }
        @media (prefers-reduced-motion: reduce) { .pz-smoke { animation:none !important; } }
      `}</style>
    </div>
  );
}
