# Exponer el schema `pinceles` en PostgREST / Supabase

Por defecto, la API REST de Supabase (PostgREST) solo expone `public`, `storage` y
`graphql_public`. Como todo el contenido de Pinceles vive en el schema `pinceles`,
hay que **agregarlo explícitamente**; de lo contrario las consultas con
`.schema("pinceles")` fallan con *"The schema must be one of the following…"*.

> Exponer el schema **no** reemplaza a RLS. Ambos son necesarios: PostgREST hace
> visible el schema, RLS decide qué filas puede leer/escribir cada rol.

---

## 1. Supabase Cloud (dashboard)

1. **Settings → API → Data API → Exposed schemas**.
2. Agregá `pinceles` a la lista (junto a `public`, `storage`, `graphql_public`).
3. Guardá. PostgREST recarga solo.

## 2. Supabase self-hosted (este proyecto: `api.neura.com.py`)

Editá las variables de entorno del servicio **rest** (PostgREST) en el
`docker-compose.yml` / panel de Coolify:

```env
PGRST_DB_SCHEMAS=public,storage,graphql_public,pinceles
```

Y, si usás el gateway `supabase/postgres-meta` o Kong, verificá que no filtre el schema.
Luego reiniciá **solo** el contenedor REST:

```bash
docker compose restart rest
# o en Coolify: Redeploy del servicio "rest"
```

## 3. Forzar recarga de caché sin reiniciar

Las migraciones ya ejecutan `NOTIFY pgrst, 'reload schema';` al final. También podés
lanzarlo manualmente conectado por SQL:

```sql
notify pgrst, 'reload schema';
```

---

## 4. Comprobar que el schema está disponible

```bash
# Debe responder 200 y no "schema must be one of…"
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/services?select=slug,title" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Accept-Profile: pinceles"
```

El header **`Accept-Profile: pinceles`** (lectura) / **`Content-Profile: pinceles`**
(escritura) es lo que el cliente JS envía cuando usás `supabase.schema("pinceles")`.

## 5. Comprobar RLS

```bash
# Con anon: solo debería devolver contenido publicado/visible.
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?select=slug,status" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Accept-Profile: pinceles"
# Intentar leer auditoría con anon debe devolver [] (bloqueado por RLS).
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/audit_logs?select=id" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Accept-Profile: pinceles"
```

## 6. Consumir desde el código

```ts
const supabase = createServerClient(/* ... */);
const { data } = await supabase
  .schema("pinceles")
  .from("projects")
  .select("*, category:project_categories(*), images:project_images(*)")
  .eq("status", "published")
  .eq("is_visible", true)
  .order("sort_order");
```

Nunca dependas del `search_path` por defecto: **siempre** `.schema("pinceles")`.
