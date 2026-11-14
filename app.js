(() => {
  const endpoint = (window.APP_CONFIG || {}).API_URL || "";
  const $ = id => document.getElementById(id);
  const dayNames = ["MINGGU","SENIN","SELASA","RABU","KAMIS","JUMAT","SABTU"];
  // Acuan weton: 1 Januari 2024 = Senin Pon.
  const anchor = new Date(Date.UTC(2024,0,1));
  const pasaran = ["PAHING","PON","WAGE","KLIWON","LEGI"];
  function updateClock(){
    const now = new Date();
    const local = new Date(now.toLocaleString("en-US",{timeZone:"Asia/Jakarta"}));
    const day = dayNames[local.getDay()];
    const dateOnly = new Date(Date.UTC(local.getFullYear(),local.getMonth(),local.getDate()));
    const diff = Math.round((dateOnly-anchor)/86400000);
    const market = pasaran[((diff%5)+5)%5];
    $("clock-day").textContent = `${day} · ${market}`;
    $("clock-date").textContent = new Intl.DateTimeFormat("id-ID",{timeZone:"Asia/Jakarta",day:"2-digit",month:"long",year:"numeric"}).format(now);
    $("clock-time").textContent = new Intl.DateTimeFormat("id-ID",{timeZone:"Asia/Jakarta",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);
  }
  function status(el,value){
    const v=String(value||"ADA").toUpperCase(); el.textContent=v;
    el.className="official-status "+(v.includes("KELUAR")?"off":"on");
  }
  function render(data){
    const availability=String(data.ktp_availability||"Menunggu Pengiriman");
    $("ktp-status").textContent=availability;
    const available=availability.toLowerCase()==="ada";
    $("ktp-status").style.color=available?"#3e851c":"#d27a05";
    $("ktp-pill").textContent=availability.toUpperCase();
    $("ktp-pill").className="status-pill "+(available?"success":"warning");
    $("ktp-quantity").innerHTML=`${Number(data.quantity||0).toLocaleString("id-ID")} <small>KEPING</small>`;
    for(const key of ["internet","siak"]){
      const value=String(data[key]||"Normal"); const normal=value.toLowerCase()==="normal";
      $(key+"-status").textContent=value; $(key+"-status").className="network-state "+(normal?"normal":"warning");
      $(key+"-pill").textContent=value.toUpperCase(); $(key+"-pill").className="tiny-pill "+(normal?"normal":"warning");
    }
    for(const key of ["camat","sekcam","kasipem","kasi_pmd","kasi_kesos","kasi_trantib"]) status($(key+"-status"),data[key+"_status"]||data[key]||"ADA");
    if(data.updated_at){const d=new Date(data.updated_at);const stamp=Number.isNaN(d.getTime())?data.updated_at:new Intl.DateTimeFormat("id-ID",{timeZone:"Asia/Jakarta",dateStyle:"medium",timeStyle:"short"}).format(d);$("updated-at").textContent=`Terakhir diperbarui ${stamp}${data.by?" · oleh "+data.by:""}`;}
  }
  function refresh(){
    if(!endpoint)return;
    const callback="melonCallback"+Date.now()+Math.floor(Math.random()*999);
    const script=document.createElement("script"); let done=false;
    const cleanup=()=>{if(done)return;done=true;delete window[callback];script.remove();};
    window[callback]=result=>{cleanup();if(result&&result.ok&&result.data){render(result.data);$("connection-message").textContent="TERHUBUNG · DATA TERSINKRONISASI";$("connection-message").className="connection-message connected";}else{$("connection-message").textContent="Respons database tidak valid";}};
    script.onerror=()=>{cleanup();$("connection-message").textContent="Koneksi database terputus";};
    script.src=`${endpoint}?action=read&callback=${callback}&t=${Date.now()}`;document.head.appendChild(script);
    setTimeout(()=>{if(!done){cleanup();$("connection-message").textContent="Waktu koneksi habis";}},12000);
  }
  updateClock();window.setInterval(updateClock,1000);refresh();window.setInterval(refresh,30000);
})();
