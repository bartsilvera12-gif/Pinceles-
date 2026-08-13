// postbuild: copia el export estático de Next (out/) a dist/ para subir a Hostinger.
// Se ejecuta automáticamente después de `npm run build` en la rama static-hostinger.
import { rmSync, cpSync, existsSync } from "node:fs";

if (!existsSync("out")) {
  console.error("[sync-dist] No existe out/ — ¿corriste next build con output:'export'?");
  process.exit(1);
}
rmSync("dist", { recursive: true, force: true });
cpSync("out", "dist", { recursive: true });
console.log("[sync-dist] Export copiado a dist/ ✓");
