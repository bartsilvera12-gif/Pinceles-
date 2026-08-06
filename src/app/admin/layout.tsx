"use client";

import { AuthProvider } from "@/components/admin/spa/AuthProvider";

// Panel admin client-side (SPA) para hosting estático. Toda la lógica de sesión
// corre en el navegador contra Supabase; ver src/lib/admin/spa.ts.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
