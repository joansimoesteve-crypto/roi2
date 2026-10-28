# Avatar Roi

Asistente flotante (estilo Clippy) para navegar, valorar webs, señalar elementos y opinar sobre lugares físicos.

- `extension/` — extensión Manifest V3 (Chrome, Edge, Brave).
- `public/` — web de demo que se despliega en Vercel (carga el mismo avatar en vivo).

## Probar la extensión
1. `chrome://extensions` → activar **Modo desarrollador**.
2. **Cargar descomprimida** → carpeta `extension/`.

## Subir a GitHub
```bash
git init && git add . && git commit -m "Avatar Roi v1"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/avatar-roi.git
git push -u origin main
```

## Desplegar en Vercel
Vercel → **Add New Project** → importa el repo. No hay que cambiar nada: `vercel.json` ya copia `extension/content.js` a `public/avatar.js` y publica `public/`.

## Recibir las valoraciones
En el popup de la extensión puedes pegar una URL de endpoint; cada valoración se envía por `POST` en JSON. Sin endpoint, se guardan en local y se exportan a CSV/JSON.

## Publicar en Chrome Web Store
Comprime el contenido de `extension/` en un ZIP y súbelo en el panel de desarrolladores de Chrome. Para la tienda necesitarás política de privacidad (guardas ubicación y texto del usuario).
