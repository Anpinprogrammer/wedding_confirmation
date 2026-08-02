/**
 * Pega este código en el editor de Apps Script de tu Google Sheet
 * (Extensiones > Apps Script), reemplazando el contenido de Code.gs.
 *
 * Luego despliega como "Aplicación web" (ver README.md del proyecto
 * para el paso a paso completo).
 */

const SHEET_NAME = "Respuestas"; // Cambia esto si tu hoja tiene otro nombre

function doPost(e) {
  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
      SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    // Crea encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha de envío",
        "N° de personas",
        "Nombres",
        "Nombre: Plato",
        "Mensaje",
      ]);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.guestCount || "",
      data.guestNames || "",
      data.guestMeals || "",
      data.message || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Útil para probar que el despliegue responde (visita la URL /exec en el navegador)
function doGet() {
  return ContentService.createTextOutput(
    "El endpoint está activo. Usa POST para enviar datos."
  );
}
