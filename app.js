(() => {
  const config = window.APP_CONFIG || {};
  const endpoint = config.API_URL || "";
  const initial = {
    ktp_availability: "Menunggu Pengiriman",
    quantity: 100,
    internet: "Normal",
    siak: "Normal",
    updated_at: ""
  };

  const byId = (id) => document.getElementById(id);
  const clean = (value) => String(value ?? "").trim();

  function setStatus(id, pillId, value) {
    const normal = clean(value).toLowerCase() === "normal";
    const element = byId(id);
    const pill = byId(pillId);
    element.textContent = clean(value) || "Belum diperbarui";
    element.className = `status-value ${normal ? "status-normal" : "status-warning"}`;
    pill.textContent = (clean(value) || "BELUM DIPERBARUI").toUpperCase();
    pill.className = `pill ${normal ? "pill-normal" : "pill-warning"}`;
  }

  function render(data) {
    const availability = clean(data.ktp_availability) || initial.ktp_availability;
    const isAvailable = availability.toLowerCase() === "ada";
    byId("ktp-status").textContent = availability;
    byId("ktp-status").className = `status-value ${isAvailable ? "status-normal" : "status-warning"}`;
    byId("ktp-pill").textContent = availability.toUpperCase();
    byId("ktp-pill").className = `pill ${isAvailable ? "pill-normal" : "pill-warning"}`;
    const quantity = Number(data.quantity);
    byId("ktp-quantity").innerHTML = `${Number.isFinite(quantity) ? quantity.toLocaleString("id-ID") : 0} <small>Buah</small>`;
    setStatus("internet-status", "internet-pill", data.internet || initial.internet);
    setStatus("siak-status", "siak-pill", data.siak || initial.siak);

    if (data.updated_at) {
      const date = new Date(data.updated_at);
      byId("updated-at").textContent = `Terakhir diperbarui: ${Number.isNaN(date.getTime()) ? data.updated_at : date.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}`;
    }
  }

  async function refresh() {
    if (!endpoint || endpoint.includes("TEMPEL_URL_WEB_APP")) return;
    try {
      const response = await fetch(`${endpoint}?action=read&t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const result = await response.json();
      if (result && result.ok && result.data) {
        render(result.data);
        byId("connection-message").textContent = "Data status pelayanan berhasil diperbarui dari database.";
        byId("connection-message").classList.add("connected");
      } else {
        throw new Error(result.message || "Respons database tidak sesuai.");
      }
    } catch (error) {
      byId("connection-message").textContent = "Belum dapat mengambil data terbaru. Informasi terakhir yang tersedia tetap ditampilkan.";
      byId("connection-message").classList.remove("connected");
      console.warn("Gagal memperbarui papan pengumuman:", error);
    }
  }

  render(initial);
  refresh();
  window.setInterval(refresh, 30000);
})();
