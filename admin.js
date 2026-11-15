
/* =====================================================
   REPUBLIK MELON
   ADMIN PANEL - admin.js
   Kecamatan Wates, Kabupaten Blitar
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("admin-form");
  const saveButton = form
    ? form.querySelector('button[type="submit"]')
    : null;

  const messageBox = document.getElementById("save-message");

  // Ambil alamat API dari config.js
  const API_URL = window.APP_CONFIG
    ? window.APP_CONFIG.API_URL
    : "";

  // Tampilkan pesan
  function showMessage(message, type) {
    if (!messageBox) {
      alert(message);
      return;
    }

    messageBox.textContent = message;
    messageBox.className = "save-message " + (type || "");
    messageBox.style.display = "block";
  }

  // Atur kondisi tombol simpan
  function setLoading(isLoading) {
    if (!saveButton) return;

    saveButton.disabled = isLoading;
    saveButton.textContent = isLoading
      ? "Menyimpan..."
      : "Simpan Perubahan";
  }

  // Validasi awal
  if (!form) {
    console.error("Form admin-form tidak ditemukan.");
    return;
  }

  if (!API_URL) {
    showMessage(
      "Alamat API belum ditemukan. Periksa file config.js.",
      "error"
    );
    return;
  }

  // Proses penyimpanan
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    const operator = String(formData.get("by") || "").trim();
    const token = String(formData.get("token") || "").trim();
    const quantity = String(formData.get("quantity") || "").trim();

    // Validasi operator
    if (!operator) {
      showMessage("Silakan pilih nama operator.", "error");
      return;
    }

    // Validasi password/token
    if (!token) {
      showMessage("Password admin wajib diisi.", "error");
      return;
    }

    // Validasi jumlah KTP-EL
    if (quantity !== "" && Number(quantity) < 0) {
      showMessage("Jumlah KTP-EL tidak boleh negatif.", "error");
      return;
    }

    // Konfirmasi penyimpanan
    const confirmed = confirm(
      "Apakah data REPUBLIK MELON akan disimpan?"
    );

    if (!confirmed) return;

    // Susun data untuk dikirim ke Google Apps Script
    const payload = new URLSearchParams();

    payload.append("action", "save");

    for (const [key, value] of formData.entries()) {
      payload.append(key, String(value).trim());
    }

    setLoading(true);
    showMessage("Sedang menyimpan data...", "loading");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
      });

      const responseText = await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          "Respons server tidak valid. Periksa Google Apps Script."
        );
      }

      if (
        result.ok === true ||
        result.success === true
      ) {
        showMessage(
          result.message || "Data berhasil disimpan.",
          "success"
        );

        // Kosongkan password setelah berhasil
        const tokenInput = form.querySelector('[name="token"]');

        if (tokenInput) {
          tokenInput.value = "";
        }

      } else {
        throw new Error(
          result.message || "Data gagal disimpan."
        );
      }

    } catch (error) {
      console.error("Kesalahan penyimpanan:", error);

      showMessage(
        error.message ||
        "Terjadi kesalahan saat menghubungi server.",
        "error"
      );

    } finally {
      setLoading(false);
    }
  });

});
