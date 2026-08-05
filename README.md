# Pinceles — Sitio institucional

Sitio de una sola página para **Pinceles** — pintura, mantenimiento, obras y soluciones industriales.
Eslogan: *Coloreando el futuro, un trazo a la vez.*

## Cómo publicarlo

El sitio es HTML estático, no necesita build ni dependencias.

1. Subí el contenido de esta carpeta a un repositorio de GitHub.
2. En **Settings → Pages**, elegí la rama `main` y la carpeta `/ (root)`.
3. GitHub Pages sirve `index.html` automáticamente.

Para verlo en local, abrí `index.html` en el navegador (o servilo con `npx serve .`).

## Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Toda la página: secciones, estilos y lógica (menú, galería, formulario) |
| `support.js` | Runtime necesario para renderizar `index.html` |
| `images/` | Logo y fotografías de proyectos |

## Dónde cambiar los datos

Todo se edita en `index.html`:

- **Teléfono / WhatsApp**: constante `WA = "595982897118"` (formato internacional, sin `+`) y los textos visibles `0982-897118`.
- **Correo**: `pingceles@gmail.com` (aparece en la sección de contacto y en el footer).
- **Horario y cifras** (proyectos, años, clientes, zonas): valores por defecto en `renderVals()` — `horario`, `statProyectos`, `statAnios`, `statClientes`, `statZonas`. Son datos de relleno: reemplazalos por los reales.
- **Proyectos de la galería**: array `this.projects` (imagen, categoría, título, ubicación y texto alternativo).
- **Servicios, industrias y diferenciales**: arrays `services`, `industries` y `diffs` dentro de `renderVals()`.
- **Imágenes**: reemplazá los archivos de `images/` conservando el nombre, o actualizá las rutas.

## Pendiente

- Testimonios: la sección no está incluida hasta contar con comentarios reales de clientes.
- Cifras y horario: confirmar los valores definitivos.
