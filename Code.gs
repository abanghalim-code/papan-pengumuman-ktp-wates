/**
 * PAPAN PENGUMUMAN DIGITAL KTP-EL - KECAMATAN WATES
 *
 * Pasang Apps Script dari Google Sheets (Ekstensi > Apps Script).
 * Jalankan setupSheet() satu kali, lalu deploy sebagai Web App.
 *
 * Keamanan:
 * - GET hanya membaca status publik.
 * - POST mengubah data hanya jika kode akses cocok dengan Script Property ADMIN_TOKEN.
 * - Jangan menaruh ADMIN_TOKEN di file HTML/JavaScript publik.
 */

const SHEET_NAME = "Status KTP-EL";
const HEADERS = ["ktp_availability", "quantity", "internet", "siak", "updated_at"];

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Buka Apps Script dari Google Sheets yang akan digunakan.");
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  const existing = sheet.getLastRow() >= 2
    ? sheet.getRange(2, 1, 1, HEADERS.length).getValues()[0]
    : null;

  if (!existing) {
    sheet.getRange(2, 1, 1, HEADERS.length).setValues([[
      "Menunggu Pengiriman", 100, "Normal", "Normal", new Date()
    ]]);
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
  return "Sheet siap digunakan.";
}

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  if (action !== "read") return json_({ ok: false, message: "Aksi tidak dikenal." });
  try {
    const sheet = getSheet_();
    const values = sheet.getRange(2, 1, 1, HEADERS.length).getValues()[0];
    return json_({
      ok: true,
      data: {
        ktp_availability: String(values[0] || "Menunggu Pengiriman"),
        quantity: Number(values[1] || 0),
        internet: String(values[2] || "Normal"),
        siak: String(values[3] || "Normal"),
        updated_at: values[4] instanceof Date ? values[4].toISOString() : String(values[4] || "")
      }
    });
  } catch (err) {
    return json_({ ok: false, message: err.message });
  }
}

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const expectedToken = props.getProperty("ADMIN_TOKEN");
    if (!expectedToken) return json_({ ok: false, message: "ADMIN_TOKEN belum diatur." });

    const p = (e && e.parameter) || {};
    if (!p.token || p.token !== expectedToken) {
      return json_({ ok: false, message: "Kode akses tidak valid." });
    }

    const availability = String(p.ktp_availability || "");
    const quantity = Number(p.quantity);
    const internet = String(p.internet || "");
    const siak = String(p.siak || "");

    if (!["Ada", "Menunggu Pengiriman"].includes(availability)) {
      return json_({ ok: false, message: "Status ketersediaan tidak valid." });
    }
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 100000) {
      return json_({ ok: false, message: "Jumlah keping tidak valid." });
    }
    if (!["Normal", "Gangguan"].includes(internet) || !["Normal", "Gangguan"].includes(siak)) {
      return json_({ ok: false, message: "Status jaringan tidak valid." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet_();
      sheet.getRange(2, 1, 1, HEADERS.length).setValues([[
        availability, quantity, internet, siak, new Date()
      ]]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true, message: "Data berhasil diperbarui." });
  } catch (err) {
    return json_({ ok: false, message: err.message });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Spreadsheet tidak ditemukan.");
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Jalankan setupSheet() terlebih dahulu.");
  if (sheet.getLastRow() < 2) setupSheet();
  return ss.getSheetByName(SHEET_NAME);
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
