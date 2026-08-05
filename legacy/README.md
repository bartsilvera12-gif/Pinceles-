# Legacy — sitio estático original

Estos archivos (`index.html` + `support.js`) son la **versión estática original**
de Pinceles, conservados solo como referencia histórica. **Ya no se usan**: el sitio
fue migrado a una aplicación Next.js (ver el `README.md` y `docs/` en la raíz).

- `index.html`: página única con el runtime dc-runtime (todo el contenido estaba
  hardcodeado en `renderVals()`).
- `support.js`: runtime que interpretaba esa plantilla.

El contenido de estos archivos se extrajo al schema `pinceles` (ver `supabase/seed.sql`)
y ahora se administra desde el panel `/admin`. Las imágenes siguen en `../images/` y
en `../public/images/`.
