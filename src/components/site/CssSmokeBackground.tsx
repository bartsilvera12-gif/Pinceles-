// Fondo animado "humo" con CSS puro (sin WebGL). Blobs de color desenfocados
// que se desplazan suavemente = efecto de humo/flujo. Paleta de la MARCA
// (ocre #D9912F, ocre claro #DEB97F, ámbar, sobre crema). Se ve en cualquier navegador.

export function CssSmokeBackground({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "linear-gradient(135deg, #F8F6F1 0%, #F1E7D6 100%)",
        ...style,
      }}
    >
      <span className="pz-smoke pz-smoke-a" />
      <span className="pz-smoke pz-smoke-b" />
      <span className="pz-smoke pz-smoke-c" />
      <span className="pz-smoke pz-smoke-d" />
      <style>{`
        .pz-smoke { position:absolute; border-radius:50%; filter:blur(55px); will-change:transform; pointer-events:none; }
        .pz-smoke-a { width:55vw; height:55vw; left:-8%; top:-25%; background:radial-gradient(circle at 50% 50%, rgba(217,145,47,.82), rgba(217,145,47,0) 68%); animation:pzsA 15s ease-in-out infinite; }
        .pz-smoke-b { width:48vw; height:48vw; right:-6%; top:0%; background:radial-gradient(circle at 50% 50%, rgba(184,118,31,.78), rgba(184,118,31,0) 68%); animation:pzsB 19s ease-in-out infinite; }
        .pz-smoke-c { width:44vw; height:44vw; left:16%; bottom:-30%; background:radial-gradient(circle at 50% 50%, rgba(120,78,20,.5), rgba(120,78,20,0) 62%); animation:pzsC 22s ease-in-out infinite; }
        .pz-smoke-d { width:40vw; height:40vw; right:14%; bottom:-18%; background:radial-gradient(circle at 50% 50%, rgba(222,185,127,.95), rgba(222,185,127,0) 68%); animation:pzsD 17s ease-in-out infinite; }
        @keyframes pzsA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(26%,20%) scale(1.28)} }
        @keyframes pzsB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-24%,26%) scale(1.2)} }
        @keyframes pzsC { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20%,-22%) scale(1.32)} }
        @keyframes pzsD { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-22%,-16%) scale(1.24)} }
        @media (prefers-reduced-motion: reduce) { .pz-smoke { animation:none !important; } }
      `}</style>
    </div>
  );
}
