# Smart Lore MVP

Prototipo inicial de Smart Lore: landing visual, avatar de valoración, 5 emociones, 3 intensidades, análisis opcional con Gemini, historial local, perfil/avatar y QR de acceso. Incluye una extensión Chrome básica que abre la valoración de la página actual.

## Despliegue (Vercel + GitHub)

1. Sube esta carpeta a un repositorio GitHub.
2. Importa el repositorio en Vercel y despliega con los valores por defecto.
3. En Vercel → Settings → Environment Variables añade:
   - `NEXT_PUBLIC_SITE_URL`: dominio público de Vercel
   - `GEMINI_API_KEY`: clave de Google AI Studio (opcional para probar; sin ella, se guarda el comentario sin análisis IA)
   - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`: proyecto Supabase (necesarios para el acceso por correo)
4. En Supabase → Authentication → URL Configuration, añade el dominio de Vercel a Site URL y Redirect URLs.
5. Para probar en local: `cp .env.example .env.local`, rellena las claves y ejecuta `npm install && npm run dev`.

## Extensión Chrome

1. Despliega primero la web.
2. En `extension/popup.js`, sustituye `https://TU-DOMINIO.vercel.app` por el dominio desplegado.
3. Abre `chrome://extensions`, activa Developer mode y pulsa “Load unpacked” seleccionando la carpeta `extension`.
4. Para distribuirla públicamente, prepara privacidad, permisos mínimos, iconos y publicación/revisión en Chrome Web Store.

## Base de datos

`supabase/schema.sql` crea la tabla de opiniones y políticas básicas de Row Level Security. El formulario de esta demo guarda historial localmente; la sincronización real de opiniones con usuarios y panel de empresa todavía debe conectarse a Supabase antes de venderlo como producto.

## Límites honestos de esta demo

- El mapa es conceptual y no contiene datos reales ni geolocalización.
- El QR abre la landing; QR por cliente/campaña/lugar requiere identificadores y rutas dedicadas.
- La extensión abre la web en una pestaña nueva; no inyecta un avatar persistente en todas las páginas.
- El historial y perfil se guardan en el navegador, no se sincronizan entre dispositivos.
- La valoración no debe considerarse representativa sin controles contra abuso, duplicados y manipulación.
- Antes de usar con clientes reales: política de privacidad, consentimiento, borrado/exportación de datos, límites de uso de API, protección anti-spam y revisión de seguridad.
