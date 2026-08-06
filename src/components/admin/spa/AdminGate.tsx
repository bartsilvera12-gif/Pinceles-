"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Carga el panel solo cuando hace falta (no pesa en visitas normales a la home).
const AdminApp = dynamic(() => import("@/components/admin/spa/AdminApp"), {
  ssr: false,
  loading: () => <GateSpinner />,
});

function GateSpinner() {
  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#F8F6F1" }}>
      <span style={{ width: 40, height: 40, borderRadius: "50%", border: "4px solid #D9912F", borderTopColor: "transparent", animation: "pincelSpin .8s linear infinite" }} />
      <style>{`@keyframes pincelSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function isAdminPath(p: string): boolean {
  const s = p.replace(/\/+$/, "");
  return s === "/admin" || s.startsWith("/admin/");
}

/**
 * Se monta en la home. Como Hostinger sirve la home para cualquier /admin/*,
 * detecta la URL real y, si es del panel, lo renderiza a pantalla completa por
 * encima del sitio público (y oculta el público para no gastar recursos).
 */
export function AdminGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isAdminPath(window.location.pathname)) {
      setShow(true);
      document.documentElement.setAttribute("data-admin", "1");
    }
  }, []);

  if (!show) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, overflow: "auto", background: "#F8F6F1" }}>
      <AdminApp />
    </div>
  );
}
