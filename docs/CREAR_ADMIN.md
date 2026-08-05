# Crear el primer administrador

El sistema **no** tiene registro público de administradores. El primer `super_admin`
se crea con un script seguro que lee las credenciales desde variables de entorno y
**nunca** las guarda ni las imprime.

## Requisitos

- Migraciones `001` y `002` ya aplicadas (existe `pinceles.admin_profiles`).
- Variables disponibles (en `.env.local`, que está en `.gitignore`):

```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...     # solo servidor, nunca en el navegador
ADMIN_EMAIL=admin@pinceles.com.py
ADMIN_PASSWORD=una-contraseña-fuerte
ADMIN_FULL_NAME=Nombre Apellido   # opcional
```

## Ejecutar

```bash
npx tsx scripts/create-admin.ts
```

El script:

1. Crea el usuario en **Supabase Auth** (o reutiliza el existente).
2. Hace *upsert* de su perfil en `pinceles.admin_profiles` con rol `super_admin` y `is_active = true`.
3. No imprime ni almacena la contraseña.
4. Es **idempotente**: podés correrlo varias veces sin duplicar.

## Notas de seguridad

- La contraseña viaja solo en la variable de entorno del proceso; no queda en logs.
- Cambiá `ADMIN_PASSWORD` por una contraseña fuerte y única.
- Después de crear el admin, podés **borrar** `ADMIN_PASSWORD` de tu `.env.local`.
- Para crear más usuarios, usá el panel **/admin/usuarios** (solo super_admin).
- El sistema protege el **último super_admin activo**: no se puede eliminar ni
  desactivar si es el único (trigger `protect_last_super_admin`).
