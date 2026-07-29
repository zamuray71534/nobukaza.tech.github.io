# Nobukaza Tech — Tienda virtual

Todo lo que necesitas para tener tu tienda funcionando en **GitHub Pages**, gratis.

## Archivos incluidos

| Archivo | Qué es | ¿Se sube a GitHub? |
|---|---|---|
| `index.html` | Tu tienda — la ven tus clientes | ✅ Sí |
| `admin.html` | Tu panel de control — editas productos, precios, stock, marca, etc. | ✅ Sí |
| `social-preview.png` | Imagen que aparece al compartir el link en WhatsApp/Facebook | ✅ Sí |
| `.nojekyll` | Archivo técnico obligatorio (evita errores de publicación) | ✅ Sí |
| `google-apps-script.gs` | Código para registrar pedidos en Google Sheets | ❌ No — se pega en Google Apps Script, no en GitHub |

---

## Parte 1 — Publicar la tienda en GitHub Pages

### 1. Crea una cuenta en GitHub (si no tienes)
[https://github.com/join](https://github.com/join)

### 2. Crea un repositorio nuevo
1. Arriba a la derecha, clic en **+** → **New repository**.
2. Nombre: el que quieras, por ejemplo `nobukaza-tech-store` (sin espacios ni tildes).
3. Marca **Public** (obligatorio para que Pages sea gratis).
4. **No** marques "Add a README file".
5. **Create repository**.

### 3. Sube los archivos
1. En el repositorio recién creado, clic en **uploading an existing file** (o **Add file → Upload files**).
2. Arrastra: `index.html`, `admin.html`, `social-preview.png` y `.nojekyll`.
   - ⚠️ Si tu explorador de archivos no muestra `.nojekyll` (empieza con punto y puede quedar oculto), créalo directo en GitHub: **Add file → Create new file**, nombre `.nojekyll`, déjalo vacío, **Commit new file**.
3. **Commit changes**.

### 4. Activa GitHub Pages
1. En el repositorio, pestaña **Settings**.
2. Menú izquierdo → **Pages**.
3. En "Build and deployment" → **Source**: elige **Deploy from a branch**.
4. **Branch**: `main`, carpeta **/(root)**. **Save**.
5. Espera 1-2 minutos. Arriba te aparece tu URL, algo como:
   `https://tu-usuario.github.io/nobukaza-tech-store/`

Tu tienda queda ahí, y tu panel en:
`https://tu-usuario.github.io/nobukaza-tech-store/admin.html`

### 5. Completa las URLs de SEO (una vez que tengas tu link)
Abre `index.html` con un editor de texto y reemplaza todas las apariciones de:
```
https://tu-usuario.github.io/nobukaza-tech-store/
```
por tu URL real. Aparece 5 veces: `canonical`, `og:url`, `og:image`, `twitter:image` y dentro del bloque de datos estructurados (JSON-LD). Vuelve a subir el archivo. Si prefieres, mándame tu link y lo hago yo.

### Por qué normalmente da error (y cómo este paquete lo evita)
- **`index.html` debe quedar en la raíz del repositorio**, no dentro de una carpeta — es el error más común.
- El archivo `.nojekyll` evita que GitHub intente "interpretar" tu sitio con Jekyll y lo rompa.
- Con cuenta gratuita, Pages solo funciona en repositorios **públicos**.

---

## Parte 2 — Conectar el registro de pedidos (Google Sheets)

1. Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja nueva, ej. "Pedidos Nobukaza Tech".
2. **Extensiones → Apps Script**. Borra el código de ejemplo y pega **todo** el contenido de `google-apps-script.gs`.
3. Guarda (ícono de disquete).
4. Arriba, donde dice "Seleccionar función", elige **configurarHoja** y presiona ▶ **Ejecutar** (una sola vez — crea los menús desplegables de estado).
5. **Implementar → Nueva implementación → Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. **Implementar**, acepta los permisos, copia la URL que termina en `/exec`.
7. Pégala en tu **Panel de Control** (`admin.html`), sección 2 → "URL de tu Google Apps Script" → guarda → descarga tu `index.html` actualizado → vuelve a subirlo a GitHub reemplazando el anterior.

### Activa los 2 disparadores automáticos (muy importante, una sola vez)
Sin esto, la hoja se llena bien con cada pedido, pero las columnas de tiempo y el paso automático a "Enviado" **no se actualizan solas**.

En el editor de Apps Script → ícono del reloj (Activadores) → **+ Añadir activador**, crea estos dos:

**Disparador 1:**
- Función: `actualizarTiempos`
- Tipo: Temporizador por minutos → **Cada minuto**

**Disparador 2:**
- Función: `procesarDespacho4pm`
- Tipo: Temporizador de día → **Entre las 16:00 y las 17:00**

### Qué guarda tu hoja de cálculo automáticamente
N° de orden único · fecha y hora exacta · nombre, DNI, teléfono, dirección · productos y total · estado de envío (Por enviar/Enviado/Entregado, con paso automático a las 4pm) · gestión de incidencias (Devolución/Reenviado) · tiempo transcurrido y cuenta regresiva al despacho (en vivo, cada minuto) · zona y entrega estimada (según el distrito detectado en la dirección) · enlace directo de WhatsApp al cliente.

---

## Parte 3 — Usar tu Panel de Control

Abre `admin.html`, carga tu `index.html` actual, y desde ahí puedes cambiar: marca, logo, tu WhatsApp, la cinta de anuncio, el título y color de la tienda, tus packs/combos, todos tus productos (agregar, editar, marcar sin stock, eliminar) y tus ofertas. Al terminar, **"Descargar index.html actualizado"** y sube ese archivo a GitHub reemplazando el anterior.

## ⚠️ Importante sobre `admin.html`

No tiene contraseña — cualquiera con el link puede abrirlo y editar tu tienda. No lo compartas ni lo publiques en ningún lado público; guárdalo solo para ti.
