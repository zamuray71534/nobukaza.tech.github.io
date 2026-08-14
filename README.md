# Nobukaza Tech — Tienda virtual

Todo lo que necesitas para subir tu tienda actualizada (163 productos, ofertas y combos con rotación semanal automática, contador regresivo, sección de garantía) a **GitHub Pages**, gratis.

## Archivos que necesitas subir a GitHub

| Archivo | Qué es |
|---|---|
| `index.html` | Tu tienda — la ven tus clientes. **163 productos**, 7 ofertas en rotación (4 visibles por semana), 5 combos, contador regresivo semanal, sección de garantía. |
| `admin.html` | Tu Panel de Control — edita productos, precios, stock, marca, ofertas, combos, etc. |
| `social-preview.png` | Imagen que aparece al compartir el link en WhatsApp/Facebook. |
| `.nojekyll` | Archivo técnico obligatorio — evita el error más común al publicar en GitHub Pages. |

Estos otros dos **no se suben a GitHub**, son para otra cosa:
- `google-apps-script.gs` → se pega en Google Apps Script (registro de pedidos en Sheets).
- `Catalogo_Actualizado_Fox_Phone.xlsx` → reporte de referencia del último catálogo de tu proveedor.

---

## Requisitos para subirlo a GitHub Pages (paso a paso)

### 1. Cuenta de GitHub
Si no tienes: [https://github.com/join](https://github.com/join)

### 2. Crea el repositorio
1. **+** (arriba a la derecha) → **New repository**.
2. Nombre sin espacios ni tildes, ej. `nobukaza-tech-store`.
3. Márcalo **Public** (obligatorio para que Pages sea gratis).
4. No actives "Add a README file".
5. **Create repository**.

### 3. Sube los 4 archivos
1. **uploading an existing file** (o **Add file → Upload files**).
2. Arrastra: `index.html`, `admin.html`, `social-preview.png`, `.nojekyll`.
   - Si tu explorador de archivos oculta `.nojekyll` (empieza con punto), créalo directo en GitHub: **Add file → Create new file** → nombre `.nojekyll` → déjalo vacío → **Commit new file**.
3. **Commit changes**.

⚠️ **`index.html` debe quedar en la raíz del repositorio**, no dentro de una carpeta — es el error más común al publicar.

### 4. Activa GitHub Pages
1. Pestaña **Settings** del repositorio.
2. Menú izquierdo → **Pages**.
3. **Source**: `Deploy from a branch`.
4. **Branch**: `main`, carpeta `/(root)`. **Save**.
5. Espera 1-2 minutos. Tu URL aparece arriba, tipo:
   `https://tu-usuario.github.io/nobukaza-tech-store/`

Tu tienda queda ahí, y tu panel en:
`https://tu-usuario.github.io/nobukaza-tech-store/admin.html`

### 5. Completa las URLs de SEO (recomendado, no obligatorio)
Abre `index.html` y reemplaza las 5 apariciones de `https://tu-usuario.github.io/nobukaza-tech-store/` por tu URL real (aparece en `canonical`, `og:url`, `og:image`, `twitter:image` y el bloque de datos estructurados). O mándame tu link y lo hago yo.

---

## Qué trae esta versión

- **163 productos** con foto, catalogados por tu proveedor más reciente, con tus márgenes de ganancia aplicados y validados (nunca por debajo del 30%).
- **Buscador** en el encabezado con filtro por categoría.
- **7 ofertas** en un pool que rota automáticamente — muestra 4 a la vez, cambia solo cada semana (sin backend, calculado en el navegador según la semana del año).
- **5 combos/packs** en el carrusel, con la misma rotación semanal.
- **Contador regresivo** en rojo en ofertas y combos, que se reinicia solo cada domingo a medianoche.
- **Sección de garantía** explicando el proceso de cambio por producto dañado, con nota corta también en el carrito.
- **Registro de pedidos** en Google Sheets vía Apps Script, con N° de orden automático, fecha/hora, estado de envío (Por enviar/Enviado/Entregado) y gestión de incidencias.
- Encabezados de seguridad (CSP, Referrer-Policy), enlaces externos protegidos, formularios saneados.

## ⚠️ Importante sobre `admin.html`

No tiene contraseña — cualquiera con el link puede editarlo. No lo compartas ni lo publiques en ningún lado público.
