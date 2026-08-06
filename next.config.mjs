/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://api.neura.com.py").hostname;
  } catch {
    return "api.neura.com.py";
  }
})();

const nextConfig = {
  // `standalone` es para Docker/Coolify. En Vercel (VERCEL=1) hay que usar la
  // salida nativa: con standalone, Vercel no rutea y devuelve 404 en todo.
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  reactStrictMode: true,
  poweredByHeader: false,
  // Oculta el botón indicador de desarrollo de Next.js (la "N" en la esquina).
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
