export interface NavGroup {
  heading: string;
  items: NavLink[];
}
export interface NavLink {
  label: string;
  href: string;
  icon: string; // nombre lucide (kebab)
  superOnly?: boolean;
}

export const ADMIN_NAV: NavGroup[] = [
  {
    heading: "General",
    items: [
      { label: "Resumen", href: "/admin", icon: "layout-dashboard" },
      { label: "Configuración", href: "/admin/general", icon: "settings", superOnly: true },
      { label: "Secciones", href: "/admin/secciones", icon: "layers" },
    ],
  },
  {
    heading: "Contenido",
    items: [
      { label: "Hero", href: "/admin/hero", icon: "image" },
      { label: "Servicios", href: "/admin/servicios", icon: "briefcase" },
      { label: "Nosotros", href: "/admin/nosotros", icon: "users" },
      { label: "Proceso", href: "/admin/proceso", icon: "list-checks" },
      { label: "Proyectos", href: "/admin/proyectos", icon: "image" },
      { label: "Industrias", href: "/admin/industrias", icon: "factory" },
      { label: "Diferenciales", href: "/admin/diferenciales", icon: "award" },
      { label: "Testimonios", href: "/admin/testimonios", icon: "message-square" },
      { label: "Contacto", href: "/admin/contacto", icon: "phone" },
    ],
  },
  {
    heading: "Operación",
    items: [
      { label: "Solicitudes", href: "/admin/solicitudes", icon: "inbox" },
      { label: "Multimedia", href: "/admin/multimedia", icon: "images" },
    ],
  },
];
