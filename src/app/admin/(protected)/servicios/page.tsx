import { redirect } from "next/navigation";

// Página ocultada a pedido: acceso por URL bloqueado (redirige al panel).
// La implementación original está en el historial de git (revertir para restaurar).
export default async function Page() {
  redirect("/admin");
}
