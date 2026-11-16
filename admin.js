/* REPUBLIK MELON - Admin panel
   Pengiriman memakai form + iframe agar tidak terhalang CORS fetch.
*/
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("admin-form");
  const saveButton = form?.querySelector('button[type="submit"]');
  const messageBox = document.getElementById("save-message");
  const quantityInput = document.getElementById("quantity");
  const availabilityInput = document.getElementById("ktp-availability");
  const API_URL = window.APP_CONFIG?.API_URL || "";

  let activeNonce = "";

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
      ? "Mengirim data..."
      : "Simpan seluruh perubahan";
  }

  if (!form) {
    console.error("Form admin-form tidak ditemukan.");
    return;
  }

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

  // Respons Apps Script mengirim postMessage dari iframe ini.
  const responseFrame = document.createElement("iframe");
  responseFrame.name = "melon-admin-response";
  responseFrame.title = "Respons penyimpanan";
  responseFrame.style.display = "none";
  document.body.appendChild(responseFrame);

  window.addEventListener("message", function (event) {
    if (!event.data ||
    event.data.type !== "REPUBLIK_MELON_SAVE" ||
    event.data.nonce !== activeNonce) return;
    const data = event.data;
    if (!data || data.type !== "REPUBLIK_MELON_SAVE" || data.nonce !== activeNonce) return;

    activeNonce = "";
    setLoading(false);

    if (data.result && data.result.ok === true) {
      showMessage(data.result.message || "Data berhasil disimpan.", "success");
      form.querySelector('[name="token"]').value = "";
    } else {
      showMessage(
        (data.result && data.result.message) || "Data gagal disimpan. Periksa kode akses dan Google Sheets.",
        "error"
      );
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    syncKtpAvailability();

    const formData = new FormData(form);
    const operator = String(formData.get("by") || "").trim();
    const token = String(formData.get("token") || "").trim();
    const quantity = String(formData.get("quantity") || "").trim();
    const quantityNumber = Number(quantity);

    if (!operator) return showMessage("Silakan pilih nama operator.", "error");
    if (!token) return showMessage("Kode akses admin wajib diisi.", "error");
    if (
      quantity === "" ||
      !Number.isInteger(quantityNumber) ||
      quantityNumber < 0 ||
      quantityNumber > 100000
    ) {
      return showMessage("Jumlah keping KTP harus bilangan bulat antara 0 sampai 100.000.", "error");
    }

    if (!confirm("Apakah data REPUBLIK MELON akan disimpan?")) return;

    activeNonce = "melon_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    formData.set(
      "ktp_availability",
      quantityNumber >= 1 ? "Ada" : "Menunggu Pengiriman"
    );
    formData.set("nonce", activeNonce);

    const postForm = document.createElement("form");
    postForm.method = "POST";
    postForm.action = API_URL;
    postForm.target = responseFrame.name;
    postForm.style.display = "none";

    for (const [key, value] of formData.entries()) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      postForm.appendChild(input);
    }

    document.body.appendChild(postForm);
    setLoading(true);
    showMessage("Sedang mengirim data ke Google Sheets...", "loading");
    postForm.submit();
    postForm.remove();

    // Jika Apps Script tidak mengirim balasan, jangan menganggap penyimpanan berhasil.
    const submittedNonce = activeNonce;
    window.setTimeout(function () {
      if (activeNonce === submittedNonce) {
        activeNonce = "";
        setLoading(false);
        showMessage(
          "Belum ada konfirmasi dari server. Periksa deployment Google Apps Script dan coba lagi.",
          "error"
        );
      }
    }, 30000);
  });
});
