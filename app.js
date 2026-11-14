
(() => {
  const config = window.APP_CONFIG || {};
  const endpoint = config.API_URL || "";

  const initial = {
    ktp_availability: "Menunggu Pengiriman",
    quantity: 100,
    internet: "Normal",
    siak: "Normal",
    updated_at: "",
    by: ""
  };

  const byId = id => document.getElementById(id);
  const clean = value => String(value ?? "").trim();

  function setStatus(id, pillId, value) {
    const normal = clean(value).toLowerCase() === "normal";
    const element = byId(id);
    const pill = byId(pillId);

    element.textContent = clean(value) || "Belum diperbarui";
    element.className =
      `status-value ${normal ? "status-normal" : "status-warning"}`;

    pill.textContent =
      (clean(value) || "BELUM DIPERBARUI").toUpperCase();

    pill.className =
      `pill ${normal ? "pill-normal" : "pill-warning"}`;
  }

  function render(data) {
    const availability =
      clean(data.ktp_availability) || initial.ktp_availability;

    const isAvailable = availability.toLowerCase() === "ada";

    byId("ktp-status").textContent = availability;
    byId("ktp-status").className =
      `status-value ${isAvailable ? "status-normal" : "status-warning"}`;

    byId("ktp-pill").textContent = availability.toUpperCase();
    byId("ktp-pill").className =
      `pill ${isAvailable ? "pill-normal" : "pill-warning"}`;

    const quantity = Number(data.quantity);

    byId("ktp-quantity").innerHTML =
      `${Number.isFinite(quantity) ? quantity.toLocaleString("id-ID") : 0} <small>Buah</small>`;

    setStatus("internet-status", "internet-pill", data.internet);
    setStatus("siak-status", "siak-pill", data.siak);

    if (data.updated_at) {
      const date = new Date(data.updated_at);

      const time = Number.isNaN(date.getTime())
        ? data.updated_at
        : date.toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short"
          });

      byId("updated-at").textContent =
        `Terakhir diperbarui: ${time}` +
        (data.by ? ` oleh ${data.by}` : "");
    }
  }

  function refresh() {
    if (!endpoint) return;

    const callbackName =
      "ktpBoardCallback" + Date.now() +
      Math.floor(Math.random() * 1000);

    const script = document.createElement("script");

    let finished = false;

    function cleanup() {
      if (finished) return;
      finished = true;
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = result => {
      cleanup();

      if (result && result.ok && result.data) {
        render(result.data);

        byId("connection-message").textContent =
          "Data pelayanan berhasil diperbarui dari database.";

        byId("connection-message").classList.add("connected");
      } else {
        byId("connection-message").textContent =
          "Database memberikan respons yang tidak valid.";

        byId("connection-message").classList.remove("connected");
      }
    };

    script.onerror = () => {
      cleanup();

      byId("connection-message").textContent =
        "Gagal menghubungi database. Periksa koneksi Web App.";

      byId("connection-message").classList.remove("connected");
    };

    script.src =
      `${endpoint}?action=read&callback=${callbackName}&t=${Date.now()}`;

    document.head.appendChild(script);

    setTimeout(() => {
      if (!finished) {
        cleanup();

        byId("connection-message").textContent =
          "Waktu koneksi database habis. Silakan muat ulang halaman.";
      }
    }, 15000);
  }

  render(initial);
  refresh();

  window.setInterval(refresh, 30000);
})();
