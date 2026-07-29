/**
 * NOBUKAZA TECH — Registro de pedidos en Google Sheets
 * ---------------------------------------------------------------------------
 * Sin bots, sin APIs de terceros, sin servicios de pago. Solo Google.
 *
 * Cada pedido se guarda con:
 *   A. N° de orden (único, correlativo)
 *   B. Fecha y hora exacta del pedido
 *   C-F. Nombre, DNI, Teléfono, Dirección
 *   G. Productos del pedido
 *   H. Total (S/.)
 *   I. Estado de envío        → "Por enviar" / "Enviado" / "Entregado".
 *                                Se cambia solo de "Por enviar" a "Enviado"
 *                                todos los días a las 4pm (ver más abajo),
 *                                pero tú puedes cambiarlo a mano en cualquier
 *                                momento, incluido pasar a "Entregado".
 *   J. Gestión de incidencias → tú lo cambias manualmente: "Sin incidencia" /
 *                                "Devolución" / "Reenviado"
 *   K. Tiempo desde el pedido      → se actualiza solo, cada minuto
 *   L. Cuenta regresiva despacho 4pm → se actualiza solo, cada minuto
 *   M. Zona / entrega estimada     → se calcula sola, buscando el distrito
 *                                     o ciudad dentro del texto de la
 *                                     dirección (columna F). ES UNA
 *                                     ESTIMACIÓN por palabras clave, no un
 *                                     cálculo real de ruta/distancia — no
 *                                     hay forma gratuita de hacer eso sin
 *                                     un servicio de mapas de pago. Revisa
 *                                     el resultado si la dirección es rara.
 *   N. WhatsApp del cliente        → enlace directo (clic y se abre el
 *                                     chat) al número que el cliente puso
 *                                     en el pedido, con el código de país
 *                                     del Perú agregado automáticamente.
 *
 * =====================================================================
 * CÓMO USAR ESTE SCRIPT (una sola vez)
 * =====================================================================
 * 1. Si vienes de una versión anterior, no necesitas hoja nueva esta vez
 *    — las columnas son las mismas, solo cambió la lógica interna.
 * 2. Extensiones > Apps Script. Borra el código anterior y pega TODO este.
 * 3. Guarda (ícono de disquete).
 * 4. Seleccionar función > "configurarHoja" > ▶ Ejecutar (una vez). Crea
 *    los menús desplegables de Estado de envío e Incidencias.
 * 5. Implementar > Nueva implementación > Aplicación web. Ejecutar como
 *    "Yo". Acceso: "Cualquier usuario". Implementar.
 * 6. Copia la URL que termina en /exec y pégala en tu Panel de Control.
 *
 * =====================================================================
 * ACTIVAR LOS 2 DISPARADORES AUTOMÁTICOS (una sola vez, muy importante)
 * =====================================================================
 * Sin estos dos pasos, las columnas K/L/M solo se calculan al crear cada
 * pedido y el paso de "Por enviar" a "Enviado" NUNCA pasa solo.
 *
 * En el editor de Apps Script, ícono del reloj (Activadores) en el menú
 * izquierdo > + Añadir activador, y crea estos DOS:
 *
 * Disparador 1 — actualizar tiempos cada minuto:
 *   Función: actualizarTiempos
 *   Origen del evento: Basado en tiempo
 *   Tipo: Temporizador por minutos → Cada minuto
 *
 * Disparador 2 — despacho automático de las 4pm:
 *   Función: procesarDespacho4pm
 *   Origen del evento: Basado en tiempo
 *   Tipo: Temporizador de día → Entre las 16:00 y las 17:00
 *   (Apps Script no permite elegir "exactamente 4:00pm", pero se ejecuta
 *   dentro de esa ventana; el script igual calcula todo en base a la hora
 *   exacta en la que corre, así que el resultado es correcto.)
 *
 * Nota sobre el disparador de cada minuto: en cuentas gratuitas de Google
 * hay una cuota diaria de tiempo de ejecución de scripts (~90 min/día).
 * Con pocos pedidos por hoja esto no debería ser problema, pero si algún
 * día ves que deja de actualizarse, prueba a bajar la frecuencia a "cada
 * 5 minutos" en el Disparador 1.
 */

const HORA_DESPACHO = 16; // 4:00 p.m. — hora de corte de despacho diario

/* ===================== Registro de pedidos ===================== */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "N° de orden", "Fecha y hora", "Nombre y apellidos", "DNI", "Teléfono",
        "Dirección / domicilio", "Productos del pedido", "Total (S/.)",
        "Estado de envío", "Gestión de incidencias",
        "Tiempo desde el pedido", "Cuenta regresiva despacho 4pm",
        "Zona / entrega estimada", "WhatsApp del cliente"
      ]);
    }

    var data = JSON.parse(e.postData.contents);
    var numeroOrden = generarNumeroOrden();
    var ahora = new Date();

    var fila = sheet.getLastRow() + 1;
    sheet.getRange(fila, 1, 1, 10).setValues([[
      numeroOrden, ahora,
      data.nombre || "", data.dni || "", data.telefono || "",
      data.direccion || "", data.productos || "", data.total || "",
      "Por enviar", "Sin incidencia"
    ]]);
    sheet.getRange(fila, 2).setNumberFormat("dd/mm/yyyy hh:mm");

    // N: WhatsApp del cliente — enlace directo, listo para hacer clic y
    // abrirle el chat, para cualquier consulta sobre su pedido.
    sheet.getRange(fila, 14).setFormula(formulaWhatsappCliente(data.telefono));

    actualizarFila(sheet, fila);

    var fechaTexto = Utilities.formatDate(ahora, "GMT-5", "dd/MM/yyyy HH:mm");
    return jsonOutput({ status: "ok", numeroOrden: numeroOrden, fecha: fechaTexto });

  } catch (err) {
    return jsonOutput({ status: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return jsonOutput({ status: "ok", message: "Nobukaza Tech — endpoint de pedidos activo" });
}

function generarNumeroOrden() {
  var props = PropertiesService.getScriptProperties();
  var actual = parseInt(props.getProperty("ULTIMO_NUMERO_ORDEN") || "0", 10);
  var siguiente = actual + 1;
  props.setProperty("ULTIMO_NUMERO_ORDEN", String(siguiente));
  return "NBK-" + String(siguiente).padStart(6, "0");
}

/**
 * Arma una fórmula =HYPERLINK(...) con el número del cliente ya limpio y
 * con el código de país del Perú (51) agregado si hace falta, para que
 * en la columna N puedas hacer un solo clic y abrirle el chat de
 * WhatsApp al cliente por cualquier consulta de su pedido.
 */
function formulaWhatsappCliente(telefono) {
  if (!telefono) return '="Sin teléfono"';
  var soloNumeros = String(telefono).replace(/\D/g, "");
  if (soloNumeros.length === 9) soloNumeros = "51" + soloNumeros; // celular peruano sin código de país
  var textoVisible = "+" + soloNumeros;
  return '=HYPERLINK("https://wa.me/' + soloNumeros + '","' + textoVisible + '")';
}

/* ===================== Despacho automático de las 4pm ===================== */

/**
 * Cambia "Por enviar" → "Enviado" en todos los pedidos del día, EXCEPTO
 * los que se registraron en la última hora antes de que corra este
 * disparador (esos se quedan "Por enviar" para el despacho siguiente,
 * porque no dio tiempo de alistarlos). Conéctala a un disparador diario
 * entre las 4pm y 5pm (ver instrucciones arriba).
 */
function procesarDespacho4pm() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var ahora = new Date();
  var unaHoraMs = 60 * 60 * 1000;

  for (var fila = 2; fila <= lastRow; fila++) {
    var estado = sheet.getRange(fila, 9).getValue();
    var fechaPedido = sheet.getRange(fila, 2).getValue();
    if (estado !== "Por enviar" || !(fechaPedido instanceof Date)) continue;

    var antiguedadMs = ahora - fechaPedido;
    if (antiguedadMs >= unaHoraMs) {
      sheet.getRange(fila, 9).setValue("Enviado");
    }
    // si antiguedadMs < 1 hora, se deja como "Por enviar" a propósito
  }

  actualizarTiempos(); // refresca K, L y M con los nuevos estados
}

/* ===================== Tiempos y zona de entrega automáticos ===================== */

/**
 * Recalcula el tiempo transcurrido, la cuenta regresiva al despacho de
 * las 4pm y la zona/entrega estimada para TODAS las filas. Conéctala a
 * un disparador cada minuto (ver instrucciones arriba).
 */
function actualizarTiempos() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  for (var fila = 2; fila <= lastRow; fila++) {
    actualizarFila(sheet, fila);
  }
}

function actualizarFila(sheet, fila) {
  var fechaPedido = sheet.getRange(fila, 2).getValue();
  var estadoEnvio = sheet.getRange(fila, 9).getValue();
  var direccion = sheet.getRange(fila, 6).getValue();
  if (!(fechaPedido instanceof Date)) return;

  var ahora = new Date();

  // K: Tiempo transcurrido desde que se hizo el pedido
  var transcurridoMs = ahora - fechaPedido;
  sheet.getRange(fila, 11).setValue(formatearDuracion(transcurridoMs));

  // Próximo despacho de las 4pm (se reutiliza para L y M)
  var proximoDespacho = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), HORA_DESPACHO, 0, 0);
  var esHoy = true;
  if (ahora >= proximoDespacho) {
    proximoDespacho.setDate(proximoDespacho.getDate() + 1);
    esHoy = false;
  }

  // L: Cuenta regresiva al próximo despacho
  var textoRegresiva;
  if (estadoEnvio === "Enviado" || estadoEnvio === "Entregado") {
    textoRegresiva = "Ya despachado";
  } else {
    var faltanMs = proximoDespacho - ahora;
    textoRegresiva = formatearDuracion(faltanMs) + (esHoy ? " para el despacho de hoy" : " para el despacho de mañana");
  }
  sheet.getRange(fila, 12).setValue(textoRegresiva);

  // M: Zona / entrega estimada (automática, por palabras clave en la dirección)
  sheet.getRange(fila, 13).setValue(calcularZonaEntrega(direccion, proximoDespacho));
}

function formatearDuracion(ms) {
  if (ms < 0) ms = 0;
  var totalMin = Math.floor(ms / 60000);
  var dias = Math.floor(totalMin / 1440);
  var horas = Math.floor((totalMin % 1440) / 60);
  var min = totalMin % 60;
  if (dias > 0) return dias + "d " + horas + "h " + min + "m";
  if (horas > 0) return horas + "h " + min + "m";
  return min + "m";
}

/**
 * Estima zona y fecha/hora de llegada según palabras clave encontradas en
 * la dirección de texto libre. Origen fijo: Lince, Lima.
 * ESTO ES UNA APROXIMACIÓN, no un cálculo real de ruta ni distancia.
 */
var DISTRITOS_LIMA = [
  "lince","miraflores","san isidro","surco","santiago de surco","la molina",
  "san borja","jesus maria","jesús maría","magdalena","pueblo libre",
  "san miguel","barranco","chorrillos","villa el salvador",
  "villa maria del triunfo","villa maría del triunfo","san juan de miraflores",
  "surquillo","ate","santa anita","el agustino","san luis","la victoria",
  "rimac","rímac","comas","los olivos","san martin de porres",
  "san martín de porres","independencia","puente piedra","carabayllo",
  "callao","bellavista","la perla","la punta","ventanilla",
  "san juan de lurigancho","chaclacayo","cieneguilla","lurin","lurín",
  "pachacamac","pucusana","punta hermosa","punta negra","san bartolo",
  "santa maria del mar","santa maría del mar","chosica","lurigancho","lima"
];

var CIUDADES_PROVINCIA = [
  "arequipa","trujillo","chiclayo","piura","cusco","cuzco","iquitos",
  "huancayo","tacna","ica","chimbote","cajamarca","pucallpa","ayacucho",
  "puno","tumbes","huanuco","huánuco","juliaca","abancay","huaraz",
  "moquegua","tarapoto","cerro de pasco","huancavelica","chachapoyas",
  "moyobamba","puerto maldonado"
];

function calcularZonaEntrega(direccion, proximoDespacho) {
  if (!direccion) return "Sin dirección registrada";
  var texto = String(direccion).toLowerCase();

  var esLima = DISTRITOS_LIMA.some(function(d){ return texto.indexOf(d) !== -1; });
  if (esLima) {
    var llegada = new Date(proximoDespacho.getTime() + 4 * 60 * 60 * 1000); // +4h tras el despacho
    return "Lima Metropolitana — llega aprox. " + Utilities.formatDate(llegada, "GMT-5", "dd/MM HH:mm") + " (mismo día del despacho)";
  }

  var esProvinciaPrincipal = CIUDADES_PROVINCIA.some(function(c){ return texto.indexOf(c) !== -1; });
  if (esProvinciaPrincipal) {
    var llegadaProv = new Date(proximoDespacho.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 días
    return "Provincia (ciudad principal) — llega aprox. " + Utilities.formatDate(llegadaProv, "GMT-5", "dd/MM") + " (2-3 días hábiles)";
  }

  var llegadaGenerica = new Date(proximoDespacho.getTime() + 4 * 24 * 60 * 60 * 1000); // +4 días
  return "Zona no identificada — estimado " + Utilities.formatDate(llegadaGenerica, "GMT-5", "dd/MM") + " (3-5 días hábiles, confirmar manualmente)";
}

/* ===================== Configuración inicial (una vez) ===================== */

/**
 * Crea los menús desplegables de "Estado de envío" y "Gestión de
 * incidencias" para las primeras 500 filas. Ejecútala UNA SOLA VEZ desde
 * el editor (Seleccionar función > configurarHoja > ▶ Ejecutar).
 */
function configurarHoja() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var reglaEnvio = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Por enviar", "Enviado", "Entregado"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 9, 500, 1).setDataValidation(reglaEnvio);

  var reglaIncidencias = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Sin incidencia", "Devolución", "Reenviado"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 10, 500, 1).setDataValidation(reglaIncidencias);

  SpreadsheetApp.getUi().alert("Listo: menús desplegables configurados en las columnas I y J.");
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
