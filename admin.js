(() => {
 const endpoint=(window.APP_CONFIG||{}).API_URL||"";const form=document.getElementById("admin-form");const message=document.getElementById("save-message");const button=form.querySelector('button[type="submit"]');const operators=["udin","hari","fatkhur","enik"];
 form.addEventListener("submit",event=>{event.preventDefault();const payload=Object.fromEntries(new FormData(form).entries());payload.token=document.getElementById("admin-token").value.trim();payload.by=document.getElementById("operator").value;
 if(!endpoint){message.textContent="URL database belum dipasang.";return;}if(!operators.includes(payload.by)||!payload.token){message.textContent="Petugas dan kode akses wajib diisi.";return;}
 button.disabled=true;button.textContent="Mengirim…";message.textContent="Mengirim perubahan ke database…";
 const frame=document.createElement("iframe");frame.name="melon-admin-frame";frame.hidden=true;document.body.appendChild(frame);const post=document.createElement("form");post.method="POST";post.action=endpoint;post.target=frame.name;post.hidden=true;
 Object.entries(payload).forEach(([name,value])=>{const input=document.createElement("input");input.type="hidden";input.name=name;input.value=String(value);post.appendChild(input);});let finished=false,submitted=false,timer;
 const finish=(ok,text)=>{if(finished)return;finished=true;clearTimeout(timer);frame.removeEventListener("load",onLoad);frame.remove();post.remove();button.disabled=false;button.textContent="Simpan seluruh perubahan";message.textContent=text;message.className="save-message "+(ok?"success":"error");if(ok)document.getElementById("admin-token").value="";};
 function onLoad(){if(submitted)finish(true,"Permintaan terkirim. Pastikan riwayat terbaru muncul di Google Sheets.");}
 frame.addEventListener("load",onLoad);document.body.appendChild(post);timer=setTimeout(()=>finish(false,"Belum ada konfirmasi. Periksa eksekusi Apps Script dan Google Sheets."),20000);submitted=true;post.submit();
 });
})();
