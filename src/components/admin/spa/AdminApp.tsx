"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/admin/spa/AuthProvider";

import AdminHomePage from "@/app/admin/page";
import HeroAdminPage from "@/app/admin/hero/page";
import NosotrosAdminPage from "@/app/admin/nosotros/page";
import ProcesoAdminPage from "@/app/admin/proceso/page";
import DiferencialesAdminPage from "@/app/admin/diferenciales/page";
import TestimoniosAdminPage from "@/app/admin/testimonios/page";
import SeccionesAdminPage from "@/app/admin/secciones/page";
import ContactoAdminPage from "@/app/admin/contacto/page";
import SeoAdminPage from "@/app/admin/seo/page";
import SolicitudesAdminPage from "@/app/admin/solicitudes/page";
import AuditoriaAdminPage from "@/app/admin/auditoria/page";
import ProyectosAdminPage from "@/app/admin/proyectos/page";
import MultimediaAdminPage from "@/app/admin/multimedia/page";
import UsuariosAdminPage from "@/app/admin/usuarios/page";
import LoginPage from "@/app/admin/login/page";
import RecuperarPage from "@/app/admin/recuperar-contrasena/page";
import RestablecerPage from "@/app/admin/restablecer-contrasena/page";

// Enrutador del panel según la URL REAL del navegador. En Hostinger la home se
// sirve para cualquier /admin/*, así que este componente (montado por AdminGate
// sobre la home) decide qué sección mostrar. Reutiliza las mismas páginas.
const ROUTES: Record<string, React.ComponentType> = {
  "/admin": AdminHomePage,
  "/admin/hero": HeroAdminPage,
  "/admin/nosotros": NosotrosAdminPage,
  "/admin/proceso": ProcesoAdminPage,
  "/admin/diferenciales": DiferencialesAdminPage,
  "/admin/testimonios": TestimoniosAdminPage,
  "/admin/secciones": SeccionesAdminPage,
  "/admin/contacto": ContactoAdminPage,
  "/admin/seo": SeoAdminPage,
  "/admin/solicitudes": SolicitudesAdminPage,
  "/admin/auditoria": AuditoriaAdminPage,
  "/admin/proyectos": ProyectosAdminPage,
  "/admin/multimedia": MultimediaAdminPage,
  "/admin/usuarios": UsuariosAdminPage,
  "/admin/login": LoginPage,
  "/admin/recuperar-contrasena": RecuperarPage,
  "/admin/restablecer-contrasena": RestablecerPage,
};

export default function AdminApp() {
  const [path] = useState(() => window.location.pathname.replace(/\/+$/, "") || "/admin");
  const View = ROUTES[path] ?? AdminHomePage;
  return (
    <AuthProvider>
      <View />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
