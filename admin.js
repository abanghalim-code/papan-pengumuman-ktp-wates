/* REPUBLIK MELON - Admin panel - Kecamatan Wates */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("admin-form");
  const saveButton = form?.querySelector('button[type="submit"]');
  const messageBox = document.getElementById("save-message");
  const quantityInput = document.getElementById("quantity");
  const availabilityInput = document.getElementById("ktp-availability");

  const API_URL = window.APP_CONFIG?.API_URL || "";

  function showMessage(message, type = "") {
    if (!messageBox) {
      alert(message);
      return;
    }
    messageBox.textContent = message;
    messageBox.className = "save-message " + type;
    messageBox.style.display = "block";
  }

  function setLoading(loading) {
    if (!saveButton) return;
    saveButton.disabled = loading;
    saveButton.textContent = loading
      ? "Menyimpan..."
      : "Simpan seluruh perubahan";
  }

  if (!form) {
    console.error("Form admin-form tidak ditemukan.");
    return;
  }

  // 0 keping = Menunggu Pengiriman; 1 keping atau lebih = Ada.
  function syncKtpAvailability() {
    const raw = quantityInput.value.trim();
    const quantity = raw === "" ? 0 : Number(raw);
    availabilityInput.value =
      Number.isFinite(quantity) && quantity >= 1
        ? "Ada"
        : "Menunggu Pengiriman";
  }

  quantityInput.addEventListener("input", syncKtpAvailability);
  quantityInput.addEventListener("change", syncKtpAvailability);
  syncKtpAvailability();

  if (!API_URL) {
    showMessage("Alamat API belum ditemukan. Periksa file config.js.", "error");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    syncKtpAvailability();

    const formData = new FormData(form);
    const operator = String(formData.get("by") || "").trim();
    const token = String(formData.get("token") || "").trim();
    const quantity = String(formData.get("quantity") || "").trim();
    const quantityNumber = Number(quantity);

    if (!operator) {
      showMessage("Silakan pilih nama operator.", "error");
      return;
    }
    if (!token) {
      showMessage("Kode akses admin wajib diisi.", "error");
      return;
    }
    if (
      quantity === "" ||
      !Number.isInteger(quantityNumber) ||
      quantityNumber < 0 ||
      quantityNumber > 100000
    ) {
      showMessage("Jumlah keping KTP harus bilangan bulat antara 0 sampai 100.000.", "error");
      return;
    }

    if (!confirm("Apakah data REPUBLIK MELON akan disimpan?")) return;

    const payload = new URLSearchParams();
    payload.append("action", "save");

    for (const [key, value] of formData.entries()) {
      payload.append(key, String(value).trim());
    }

    // Tetapkan ulang agar nilai status otomatis selalu terkirim.
    payload.set(
      "ktp_availability",
      quantityNumber >= 1 ? "Ada" : "Menunggu Pengiriman"
    );

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
      } catch {
        throw new Error("Respons server tidak valid. Periksa Google Apps Script.");
      }

      if (result.ok === true || result.success === true) {
        showMessage(result.message || "Data berhasil disimpan.", "success");
        form.querySelector('[name="token"]').value = "";
      } else {
        throw new Error(result.message || "Data gagal disimpan.");
      }
    } catch (error) {
      console.error("Kesalahan penyimpanan:", error);
      showMessage(
        error.message || "Terjadi kesalahan saat menghubungi server.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  });
});
