# Nobukaza Tech — Tienda virtual

Este paquete tiene todo lo necesario para publicar tu tienda en **GitHub Pages**, gratis.

## Archivos incluidos

- `index.html` — tu tienda (la ven tus clientes).
- `admin.html` — tu panel de control (editas productos, precios, stock, etc.).
- `.nojekyll` — archivo técnico obligatorio, no lo borres ni lo edites. Evita que GitHub intente "interpretar" tu tienda y la rompa al publicarla.
- `google-apps-script.gs` — código para guardar tus pedidos en Google Sheets (no se sube a GitHub, es solo para pegarlo en Google Apps Script, como ya viste antes).

---

## Cómo publicar en GitHub Pages (una sola vez)

### 1. Crea una cuenta en GitHub
Si no tienes una: [https://github.com/join](https://github.com/join)

### 2. Crea un repositorio nuevo
1. Arriba a la derecha, clic en **+** → **New repository**.
2. Nombre del repositorio: escribe lo que quieras, por ejemplo `nobukaza-tech-store` (evita espacios y tildes).
3. Marca **Public** (tiene que ser público para que Pages sea gratis).
4. **No** marques "Add a README file" (ya tienes uno).
5. Clic en **Create repository**.

### 3. Sube los archivos
1. En la página del repositorio recién creado, clic en **uploading an existing file** (o el botón **Add file → Upload files**).
2. Arrastra estos 3 archivos: `index.html`, `admin.html`, `.nojekyll`.
   - ⚠️ El archivo `.nojekyll` no tiene nombre visible en algunos exploradores de archivos (empieza con un punto). Si no lo ves al arrastrar, en GitHub puedes crearlo manualmente: clic en **Add file → Create new file**, escribe `.nojekyll` como nombre y déjalo vacío, luego **Commit new file**.
3. Abajo, clic en **Commit changes**.

### 4. Activa GitHub Pages
1. En el repositorio, ve a **Settings** (pestaña de arriba).
2. En el menú izquierdo, clic en **Pages**.
3. En "Build and deployment" → **Source**, elige **Deploy from a branch**.
4. En "Branch", elige **main** y la carpeta **/(root)**. Clic en **Save**.
5. Espera 1-2 minutos. Arriba te aparecerá la URL de tu tienda, algo como:
   `https://tu-usuario.github.io/nobukaza-tech-store/`

Tu tienda queda en esa URL, y tu panel en:
`https://tu-usuario.github.io/nobukaza-tech-store/admin.html`

---

## Por qué normalmente da error (y cómo este paquete lo evita)

- **Error más común:** subir el archivo `index.html` dentro de una subcarpeta en vez de la raíz del repositorio. Asegúrate de que al entrar al repositorio veas `index.html` directo en la lista de archivos, no dentro de una carpeta.
- **Nombre exacto:** el archivo principal debe llamarse exactamente `index.html` (minúsculas). Ya viene así.
- **Jekyll rompiendo el sitio:** GitHub intenta procesar tu sitio con un motor llamado Jekyll por defecto, lo que a veces causa errores con archivos grandes o con ciertos caracteres. El archivo `.nojekyll` que incluí desactiva eso — no lo elimines.
- **Repositorio privado:** con cuenta gratuita, Pages solo funciona en repositorios **públicos**. Si tu repo es privado, no se publicará (verás el sitio en blanco o un error 404).

## ⚠️ Importante sobre `admin.html`

Tu panel de control **no tiene contraseña** — cualquiera que tenga el link puede abrirlo y editar tu tienda. Recomendación:
- No compartas ni publiques el link a `admin.html` en ningún lado público.
- Úsalo solo tú, guardando el link en un lugar privado (notas, favoritos personales).

Si más adelante quieres que le agregue una contraseña simple de acceso, dime y lo hago.
