/**
 * NOBUKAZA TECH — Registro automático de pedidos en Google Sheets
 * -----------------------------------------------------------------
 * Este código recibe cada pedido que un cliente hace en la tienda
 * (nobukaza-tech-store) y lo guarda como una fila nueva en esta hoja.
 *
 * CÓMO USARLO (una sola vez):
 * 1. Ve a https://sheets.google.com y crea una hoja de cálculo nueva.
 *    Ponle un nombre, por ejemplo: "Pedidos Nobukaza Tech".
 * 2. Arriba, ve a Extensiones > Apps Script.
 * 3. Borra todo el código de ejemplo que aparece y pega TODO este archivo.
 * 4. Haz clic en el ícono de guardar (disquete).
 * 5. Haz clic en "Implementar" (Deploy) > "Nueva implementación".
 *    - Tipo: selecciona "Aplicación web" (Web app).
 *    - Ejecutar como: "Yo" (tu cuenta).
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone).
 * 6. Haz clic en "Implementar". Google pedirá autorización: acepta
 *    los permisos (es tu propio script, es seguro).
 * 7. Copia la URL que termina en "/exec" — esa es tu Webhook URL.
 * 8. Pégala en tu archivo index.html de la tienda, en la línea:
 *      const SHEETS_WEBHOOK_URL = "";
 *    quedando así, por ejemplo:
 *      const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycb.../exec";
 *
 * Desde ese momento, cada pedido que un cliente complete en la tienda
 * aparecerá como una fila nueva en tu hoja de cálculo, automáticamente.
 * Para descargarlo como Excel: Archivo > Descargar > Microsoft Excel (.xlsx)
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Si la hoja está vacía, agrega los encabezados primero
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Fecha y hora",
      "Nombre y apellidos",
      "Teléfono",
      "DNI",
      "Dirección / domicilio",
      "Productos del pedido",
      "Total (S/.)"
    ]);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.fecha || "",
    data.nombre || "",
    data.telefono || "",
    data.dni || "",
    data.direccion || "",
    data.productos || "",
    data.total || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
