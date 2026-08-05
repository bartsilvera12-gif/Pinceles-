/**
 * URL y anon key de Supabase.
 *
 * Ambas son PÚBLICAS por diseño: la anon key está pensada para el navegador y el
 * acceso a los datos lo controla RLS. Se dejan como valor por defecto para que el
 * sitio funcione aunque no estén configuradas las variables de entorno en el host.
 *
 * Las variables de entorno, si existen, tienen prioridad (útil para cambiar de
 * proyecto Supabase sin tocar el código).
 *
 * La SUPABASE_SERVICE_ROLE_KEY (secreta) NO va acá: se lee solo de variables de
 * entorno del servidor (ver admin.ts).
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://api.neura.com.py";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc0MTAxNDYxLCJleHAiOjE5MzE3ODE0NjF9.7_wAph8IolPMXtgfpezSwS5XR62IdD__qhqCywLDp3Q";
