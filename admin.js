
(() => {
  const config = window.APP_CONFIG || {};
  const endpoint = config.API_URL || "";

  const form = document.getElementById("admin-form");
  const message = document.getElementById("save-message");
  const button = form.querySelector('button[type="submit"]');

  const allowedOperators = [
    "udin",
    "hari",
    "fatkhur",
    "enik"
  ];

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!endpoint || endpoint.includes("TEMPEL_URL")) {
      message.textContent = "URL database belum terpasang.";
      message.className = "save-message error";
      return;
    }

    const payload = {
      token: document.getElementById("admin-token").value.trim(),
      by: document.getElementById("operator").value,
      ktp_availability: form.elements.ktp_availability.value,
      quantity: form.elements.quantity.value,
      internet: form.elements.internet.value,
      siak: form.elements.siak.value
    };

    if (!allowedOperators.includes(payload.by)) {
      message.textContent = "Silakan pilih nama petugas.";
      message.className = "save-message error";
      return;
    }

    if (!payload.token) {
      message.textContent = "Kode akses admin wajib diisi.";
      message.className = "save-message error";
      return;
    }

    button.disabled = true;
    button.textContent = "Menyimpan...";

    message.textContent = "Sedang mengirim data ke database...";
    message.className = "save-message";

    try {
      const body = new URLSearchParams(payload);

      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        redirect: "follow",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body
      });

      message.textContent =
        "Permintaan dikirim. Silakan periksa Google Sheets untuk memastikan data tersimpan.";

      message.className = "save-message success";

      document.getElementById("admin-token").value = "";

    } catch (error) {
      message.textContent =
        "Gagal mengirim data. Periksa koneksi internet.";

      message.className = "save-message error";

      console.error(error);

    } finally {
      button.disabled = false;
      button.textContent = "Simpan perubahan";
    }
  });
})();
