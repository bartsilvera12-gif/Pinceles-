/** @type {import('next').NextConfig} */

// VERSIÓN ESTÁTICA (Hostinger). Genera HTML plano en `out/` para subir por FTP.
// Sin Node, sin API, sin admin. Ver src/lib/supabase/server.ts para el porqué.
const nextConfig = {
  output: "export",
  // Rutas como carpetas con index.html (/proyectos/ -> /proyectos/index.html),
  // que es como Apache/LiteSpeed de Hostinger sirve por defecto.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  images: {
    // El export estático no tiene optimizador de imágenes en el servidor.
    unoptimized: true,
  },
};

export default nextConfig;
