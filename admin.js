
(() => {
  const endpoint = (window.APP_CONFIG || {}).API_URL || "";
  const form = document.getElementById("admin-form");
  const message = document.getElementById("save-message");
  const button = form.querySelector('button[type="submit"]');

  const operators = ["udin", "hari", "fatkhur", "enik"];

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = {
      token: document.getElementById("admin-token").value.trim(),
      by: document.getElementById("operator").value,
      ktp_availability: form.elements.ktp_availability.value,
      quantity: form.elements.quantity.value,
      internet: form.elements.internet.value,
      siak: form.elements.siak.value
    };

    if (!endpoint) {
      message.textContent = "URL database belum terpasang.";
      return;
    }

    if (!operators.includes(payload.by) || !payload.token) {
      message.textContent = "Petugas dan kode akses wajib diisi.";
      return;
    }

    button.disabled = true;
    button.textContent = "Mengirim...";
    message.textContent = "Mengirim data ke database...";

    const frame = document.createElement("iframe");
    frame.name = "ktp-save-frame";
    frame.hidden = true;
    document.body.appendChild(frame);

    const postForm = document.createElement("form");
    postForm.method = "POST";
    postForm.action = endpoint;
    postForm.target = frame.name;
    postForm.style.display = "none";

    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value);
      postForm.appendChild(input);
    });

    let submitted = false;
    let finished = false;
    let timeoutId;

    function finish(success, text) {
      if (finished) return;
      finished = true;
      clearTimeout(timeoutId);
      frame.removeEventListener("load", onLoad);
      postForm.remove();
      frame.remove();

      button.disabled = false;
      button.textContent = "Simpan perubahan";
      message.textContent = text;
      message.className = success
        ? "save-message success"
        : "save-message error";

      if (success) {
        document.getElementById("admin-token").value = "";
      }
    }

    function onLoad() {
      if (!submitted) return;
      finish(
        true,
        "POST selesai dikirim. Periksa Google Sheets untuk memastikan data tersimpan."
      );
    }

    frame.addEventListener("load", onLoad);
    document.body.appendChild(postForm);

    timeoutId = setTimeout(() => {
      finish(
        false,
        "Tidak ada konfirmasi dari server. Periksa riwayat eksekusi Apps Script."
      );
    }, 20000);

    submitted = true;
    postForm.submit();
  });
})();
