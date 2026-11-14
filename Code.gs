
/**
 * PAPAN PENGUMUMAN DIGITAL KTP-EL
 * KECAMATAN WATES - KABUPATEN BLITAR
 */

const SPREADSHEET_ID = "1H_vi9OPfe8Rnz_jGvTFQwqs5YjVKk7B_DIYD18TiDVs";
const SHEET_NAME = "Status KTP-EL";

const OPERATORS = [
  "udin",
  "hari",
  "fatkhur",
  "enik"
];

const HEADERS = [
  "ktp_availability",
  "quantity",
  "internet",
  "siak",
  "updated_at",
  "by"
];

// =====================================
// 1. MENYIAPKAN DATABASE
// =====================================

function setupSheet() {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  sheet.getRange(1, 1, 1, 6).setValues([HEADERS]);

  if (sheet.getLastRow() < 2) {

    sheet.getRange(2, 1, 1, 6).setValues([[
      "Menunggu Pengiriman",
      100,
      "Normal",
      "Normal",
      new Date(),
      "udin"
    ]]);

  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 6);

  return "Database KTP-EL berhasil disiapkan.";
}


// =====================================
// 2. MEMBUKA DATABASE
// =====================================

function getSheet_() {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error("Sheet Status KTP-EL tidak ditemukan.");
  }

  if (sheet.getLastRow() < 2) {
    throw new Error("Data utama belum tersedia.");
  }

  return sheet;
}


// =====================================
// 3. MEMBACA DATA UNTUK DASHBOARD
// =====================================

function doGet(e) {

  const p = (e && e.parameter) || {};

  if (p.action !== "read") {
    return json_({
      ok: false,
      message: "Aksi tidak dikenal."
    });
  }

  try {

    const sheet = getSheet_();

    const values = sheet.getRange(2, 1, 1, 6).getValues()[0];

    return json_({

      ok: true,

      data: {

        ktp_availability: String(values[0]),
        quantity: Number(values[1]),
        internet: String(values[2]),
        siak: String(values[3]),

        updated_at: values[4] instanceof Date
          ? values[4].toISOString()
          : String(values[4] || ""),

        by: String(values[5] || "")

      }

    });

  } catch (err) {

    return json_({
      ok: false,
      message: err.message
    });

  }

}


// =====================================
// 4. MENYIMPAN PERUBAHAN ADMIN
// =====================================

function doPost(e) {

  const lock = LockService.getScriptLock();

  try {

    const p = (e && e.parameter) || {};

    // VALIDASI TOKEN

    const token = PropertiesService
      .getScriptProperties()
      .getProperty("ADMIN_TOKEN");

    if (!token || p.token !== token) {
      throw new Error("Kode akses admin tidak valid.");
    }

    // VALIDASI PETUGAS

    const by = String(p.by || "").trim().toLowerCase();

    if (!OPERATORS.includes(by)) {
      throw new Error("Nama petugas tidak terdaftar.");
    }

    // MEMBACA INPUT

    const availability = String(p.ktp_availability || "");
    const quantity = Number(p.quantity);
    const internet = String(p.internet || "");
    const siak = String(p.siak || "");

    // VALIDASI STATUS KTP

    if (!["Ada", "Menunggu Pengiriman"].includes(availability)) {
      throw new Error("Status KTP tidak valid.");
    }

    // VALIDASI JUMLAH

    if (
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      quantity > 100000
    ) {
      throw new Error("Jumlah keping tidak valid.");
    }

    // VALIDASI JARINGAN

    if (
      !["Normal", "Gangguan"].includes(internet) ||
      !["Normal", "Gangguan"].includes(siak)
    ) {
      throw new Error("Status jaringan tidak valid.");
    }

    // KUNCI PENULISAN DATABASE

    lock.waitLock(10000);

    const sheet = getSheet_();

    const updatedAt = new Date();

    // SIMPAN ENAM KOLOM SEKALIGUS

    sheet.getRange(2, 1, 1, 6).setValues([[
      availability,
      quantity,
      internet,
      siak,
      updatedAt,
      by
    ]]);

    SpreadsheetApp.flush();

    return json_({

      ok: true,

      message: "Data berhasil disimpan.",

      data: {
        ktp_availability: availability,
        quantity: quantity,
        internet: internet,
        siak: siak,
        updated_at: updatedAt.toISOString(),
        by: by
      }

    });

  } catch (err) {

    return json_({
      ok: false,
      message: err.message
    });

  } finally {

    if (lock.hasLock()) {
      lock.releaseLock();
    }

  }

}


// =====================================
// 5. FORMAT RESPONS JSON
// =====================================

function json_(object) {

  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);

}
