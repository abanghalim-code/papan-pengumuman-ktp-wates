(() => {
  const config = window.APP_CONFIG || {};
  const endpoint = config.API_URL || "";
  const form = document.getElementById("admin-form");
  const message = document.getElementById("save-message");
  const button = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!endpoint || endpoint.includes("TEMPEL_URL_WEB_APP")) {
      message.textContent = "URL Google Apps Script belum dipasang pada config.js.";
      message.className = "save-message error";
      return;
    }

    const payload = {
      token: form.token.value.trim(),
      ktp_availability: form.ktp_availability.value,
      quantity: form.quantity.value,
      internet: form.internet.value,
      siak: form.siak.value
    };

    if (!payload.token) {
      message.textContent = "Masukkan kode akses admin.";
      message.className = "save-message error";
      return;
    }

    button.disabled = true;
    button.textContent = "Mengirim...";
    message.textContent = "Mengirim pembaruan ke database. Mohon tunggu.";
    message.className = "save-message";

    try {
      const body = new URLSearchParams(payload);
      // no-cors digunakan agar POST sederhana dapat dikirim ke Apps Script lintas domain.
      // Respons tidak dapat dibaca browser; keberhasilan diverifikasi dari halaman publik.
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        redirect: "follow",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body
      });
      message.textContent = "Permintaan pembaruan telah dikirim. Buka halaman papan publik setelah beberapa detik untuk memeriksa hasilnya.";
      message.className = "save-message success";
      form.token.value = "";
    } catch (error) {
      message.textContent = "Pengiriman gagal. Periksa koneksi internet dan URL Web App.";
      message.className = "save-message error";
      console.error(error);
    } finally {
      button.disabled = false;
      button.textContent = "Simpan perubahan";
    }
  });
})();
