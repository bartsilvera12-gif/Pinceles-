"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Layers,
  Image as ImageIcon,
  Briefcase,
  Users,
  ListChecks,
  Factory,
  Award,
  MessageSquare,
  Phone,
  Inbox,
  Images,
  Search,
  UserCog,
  ScrollText,
  Menu,
  X,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Toaster } from "sonner";
import { ADMIN_NAV } from "@/lib/admin/nav";
import type { AdminProfile } from "@/types/database.types";
import { signOutAction } from "@/lib/auth/actions";

const ICONS: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  settings: Settings,
  layers: Layers,
  image: ImageIcon,
  briefcase: Briefcase,
  users: Users,
  "list-checks": ListChecks,
  factory: Factory,
  award: Award,
  "message-square": MessageSquare,
  phone: Phone,
  inbox: Inbox,
  images: Images,
  search: Search,
  "user-cog": UserCog,
  "scroll-text": ScrollText,
};

const OCRE = "#D9912F";

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminProfile;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isSuper = admin.role === "super_admin";

  const nav = (
    <nav style={{ display: "flex", flexDirection: "column", gap: 18, padding: "8px 12px 24px" }}>
      {ADMIN_NAV.map((group) => {
        const items = group.items.filter((i) => !i.superOnly || isSuper);
        if (!items.length) return null;
        return (
          <div key={group.heading}>
            <p style={{ margin: "0 12px 8px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>
              {group.heading}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map((item) => {
                const Ico = ICONS[item.icon] ?? Layers;
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#050505" : "rgba(255,255,255,.82)",
                      background: active ? OCRE : "transparent",
                    }}
                  >
                    <Ico size={18} aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#050505" }}>
      <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/admin" style={{ display: "inline-flex" }}>
          <Image src="/images/favicon-pinceles.png" alt="Pinceles" width={40} height={40} style={{ borderRadius: 8 }} />
        </Link>
        <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} style={{ display: "none", background: "transparent", border: "none", color: "#fff", cursor: "pointer" }} className="admin-close">
          <X size={22} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{nav}</div>
      <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{admin.full_name}</p>
        <p style={{ margin: "2px 0 12px", fontSize: 12, color: "rgba(255,255,255,.5)" }}>
          {admin.role === "super_admin" ? "Super administrador" : "Editor"}
        </p>
        <form action={signOutAction}>
          <button type="submit" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "center", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,.2)", background: "transparent", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#F8F6F1", fontFamily: "var(--font-sans)", color: "#050505" }}>
      {/* Sidebar desktop */}
      <aside style={{ position: "fixed", inset: "0 auto 0 0", width: 264, zIndex: 40 }} className="admin-sidebar-desktop">
        {sidebarInner}
      </aside>

      {/* Drawer móvil */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60 }} className="admin-drawer">
          <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,5,.5)" }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", inset: "0 auto 0 0", width: 280 }}>{sidebarInner}</div>
        </div>
      )}

      {/* Contenido */}
      <div className="admin-main">
        <header style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(248,246,241,.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(5,5,5,.08)", display: "flex", alignItems: "center", gap: 12, padding: "12px clamp(16px,3vw,28px)" }}>
          <button type="button" aria-label="Abrir menú" onClick={() => setOpen(true)} className="admin-burger" style={{ display: "none", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: 10, border: "1px solid rgba(5,5,5,.14)", background: "#fff", cursor: "pointer" }}>
            <Menu size={20} />
          </button>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>Panel · Pinceles</span>
          <Link href="/" target="_blank" style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: OCRE }}>
            Ver sitio ↗
          </Link>
        </header>
        <main style={{ padding: "clamp(18px,3vw,32px)", maxWidth: 1200, margin: "0 auto" }}>{children}</main>
      </div>

      <Toaster richColors position="top-right" />

      <style>{`
        .admin-main { margin-left: 264px; }
        @media (max-width: 900px) {
          .admin-sidebar-desktop { display: none; }
          .admin-main { margin-left: 0; }
          .admin-burger { display: flex !important; }
          .admin-close { display: block !important; }
        }
      `}</style>
    </div>
  );
}
