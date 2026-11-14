/** REPUBLIK MELON - Papan Informasi Digital Kecamatan Wates */
const SPREADSHEET_ID = "1H_vi9OPfe8Rnz_jGvTFQwqs5YjVKk7B_DIYD18TiDVs";
const SHEET_NAME = "Status KTP-EL";
const OPERATORS = ["udin", "hari", "fatkhur", "enik"];
const HEADERS = ["ktp_availability","quantity","internet","siak","updated_at","by","camat_status","sekcam_status","kasipem_status","kasi_pmd_status","kasi_kesos_status","kasi_trantib_status"];
const OFFICIAL_FIELDS = ["camat_status","sekcam_status","kasipem_status","kasi_pmd_status","kasi_kesos_status","kasi_trantib_status"];

// Jalankan sekali dari editor Apps Script untuk menambah kolom tanpa menghapus data lama.
function setupSheet(){
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet=ss.getSheetByName(SHEET_NAME);
  if(!sheet) sheet=ss.insertSheet(SHEET_NAME);
  sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  if(sheet.getLastRow()<2){
    sheet.getRange(2,1,1,HEADERS.length).setValues([["Menunggu Pengiriman",100,"Normal","Normal",new Date(),"udin","ADA","ADA","ADA","ADA","ADA","ADA"]]);
  } else {
    const last=sheet.getLastRow();
    const current=sheet.getRange(2,1,last-1,HEADERS.length).getValues();
    current.forEach(row=>{for(let i=6;i<12;i++) if(!row[i]) row[i]="ADA";});
    sheet.getRange(2,1,last-1,HEADERS.length).setValues(current);
  }
  sheet.setFrozenRows(1);sheet.autoResizeColumns(1,HEADERS.length);
  return "Database REPUBLIK MELON siap: 12 kolom.";
}
function getSheet_(){
  const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if(!sheet) throw new Error("Sheet Status KTP-EL tidak ditemukan.");
  if(sheet.getLastRow()<2) throw new Error("Data utama belum tersedia.");
  return sheet;
}
function doGet(e){
  const p=(e&&e.parameter)||{};
  if(p.action!=="read") return json_({ok:false,message:"Aksi tidak dikenal."},p.callback);
  try{
    const sheet=getSheet_();
    const row=sheet.getRange(sheet.getLastRow(),1,1,HEADERS.length).getValues()[0];
    const data={ktp_availability:String(row[0]||"Menunggu Pengiriman"),quantity:Number(row[1]||0),internet:String(row[2]||"Normal"),siak:String(row[3]||"Normal"),updated_at:row[4] instanceof Date?row[4].toISOString():String(row[4]||""),by:String(row[5]||"")};
    OFFICIAL_FIELDS.forEach((key,i)=>data[key]=String(row[6+i]||"ADA"));
    return json_({ok:true,data},p.callback);
  }catch(err){return json_({ok:false,message:err.message},p.callback);}
}
function doPost(e){
  const lock=LockService.getScriptLock();
  try{
    const p=(e&&e.parameter)||{};
    const token=PropertiesService.getScriptProperties().getProperty("admin_token");
    if(!token||p.token!==token) throw new Error("Kode akses admin tidak valid.");
    const by=String(p.by||"").trim().toLowerCase();
    if(!OPERATORS.includes(by)) throw new Error("Nama petugas tidak terdaftar.");
    const availability=String(p.ktp_availability||"");
    const quantity=Number(p.quantity);
    const internet=String(p.internet||"");
    const siak=String(p.siak||"");
    if(!["Ada","Menunggu Pengiriman"].includes(availability)) throw new Error("Status KTP tidak valid.");
    if(!Number.isInteger(quantity)||quantity<0||quantity>100000) throw new Error("Jumlah keping tidak valid.");
    if(!["Normal","Gangguan"].includes(internet)||!["Normal","Gangguan"].includes(siak)) throw new Error("Status jaringan tidak valid.");
    const officials=OFFICIAL_FIELDS.map(key=>{const value=String(p[key]||"ADA").toUpperCase();if(!["ADA","KELUAR"].includes(value))throw new Error("Status pejabat tidak valid: "+key);return value;});
    lock.waitLock(10000);
    const sheet=getSheet_();
    const updatedAt=new Date();
    const nextRow=sheet.getLastRow()+1;
    sheet.getRange(nextRow,1,1,HEADERS.length).setValues([[availability,quantity,internet,siak,updatedAt,by,...officials]]);
    SpreadsheetApp.flush();
    return json_({ok:true,message:"Pembaruan REPUBLIK MELON berhasil disimpan.",data:{ktp_availability:availability,quantity,internet,siak,updated_at:updatedAt.toISOString(),by,...Object.fromEntries(OFFICIAL_FIELDS.map((key,i)=>[key,officials[i]])),row:nextRow}});
  }catch(err){return json_({ok:false,message:err.message});}
  finally{if(lock.hasLock())lock.releaseLock();}
}
function json_(object,callback){
  const payload=JSON.stringify(object);
  if(callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) return ContentService.createTextOutput(callback+"("+payload+");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}
