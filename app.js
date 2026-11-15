
(() => {
  "use strict";

  const endpoint = (window.APP_CONFIG || {}).API_URL || "";
  const $ = id => document.getElementById(id);

  const dayNames = [
    "MINGGU", "SENIN", "SELASA",
    "RABU", "KAMIS", "JUMAT", "SABTU"
  ];

  // Acuan weton: 1 Januari 2024 = Senin Pon.
  const anchor = new Date(Date.UTC(2024, 0, 1));
  const pasaran = ["PAHING", "PON", "WAGE", "KLIWON", "LEGI"];

  function updateClock() {
    const now = new Date();

    const local = new Date(
      now.toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
      })
    );

    const day = dayNames[local.getDay()];

    const dateOnly = new Date(Date.UTC(
      local.getFullYear(),
      local.getMonth(),
      local.getDate()
    ));

    const diff = Math.round(
      (dateOnly - anchor) / 86400000
    );

    const market = pasaran[((diff % 5) + 5) % 5];

    if ($("clock-day"))
      $("clock-day").textContent = `${day} · ${market}`;

    if ($("clock-date"))
      $("clock-date").textContent =
        new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Jakarta",
          day: "2-digit",
          month: "long",
          year: "numeric"
        }).format(now);

    if ($("clock-time"))
      $("clock-time").textContent =
        new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }).format(now);
  }

  function status(el, value) {
    if (!el) return;

    const v = String(value || "ADA").trim().toUpperCase();
    el.textContent = v;

    let stateClass = "on";

    if (v.includes("KELUAR")) stateClass = "off";
    else if (
      v.includes("DINAS") ||
      v.includes("CUTI") ||
      v.includes("IZIN")
    ) stateClass = "duty";

    el.className = `official-status ${stateClass}`;
  }

  function render(data) {
    const availability = String(
      data.ktp_availability || "Menunggu Pengiriman"
    );

    if ($("ktp-status")) {
      $("ktp-status").textContent = availability;
      $("ktp-status").style.color =
        availability.toLowerCase() === "ada"
          ? "#28770D"
          : "#B95100";
    }

    if ($("ktp-quantity")) {
      const quantity = Number(data.quantity || 0);
      $("ktp-quantity").textContent =
        `${quantity.toLocaleString("id-ID")} KEPING`;
    }

    for (const key of ["internet", "siak"]) {
      const value = String(data[key] || "Normal");
      const normal = value.toLowerCase() === "normal";
      const el = $(key + "-status");

      if (el) {
        el.textContent = value;
        el.className =
          `network-state ${normal ? "normal" : "warning"}`;
      }
    }

    // Sembilan posisi pejabat.
    const pejabat = [
      "camat",
      "sekcam",
      "kasipem",
      "kasi_pmd",
      "kasi_kesos",
      "kasi_trantib",
      "kasub_sunggram",
      "kasub_umpeg",
      "penyuluh_kb"
    ];

    pejabat.forEach(key => {
      const value =
        data[key + "_status"] ||
        data[key] ||
        "ADA";

      status($(key + "-status"), value);
    });

    if (data.updated_at && $("updated-at")) {
      const d = new Date(data.updated_at);

      const stamp = Number.isNaN(d.getTime())
        ? data.updated_at
        : new Intl.DateTimeFormat("id-ID", {
            timeZone: "Asia/Jakarta",
            dateStyle: "medium",
            timeStyle: "short"
          }).format(d);

      $("updated-at").textContent =
        `Terakhir diperbarui ${stamp}` +
        (data.by ? " · oleh " + data.by : "");
    }
  }

  function refresh() {
    if (!endpoint) {
      if ($("connection-message"))
        $("connection-message").textContent =
          "URL database belum dipasang.";
      return;
    }

    const callback =
      "melonCallback" +
      Date.now() +
      Math.floor(Math.random() * 999);

    const script = document.createElement("script");
    let done = false;

    const cleanup = () => {
      if (done) return;

      done = true;
      delete window[callback];
      script.remove();
    };

    window[callback] = result => {
      cleanup();

      if (result && result.ok && result.data) {
        render(result.data);

        if ($("connection-message")) {
          $("connection-message").textContent =
            "TERHUBUNG · DATA TERSINKRONISASI";

          $("connection-message").className =
            "connection-message connected";
        }
      } else if ($("connection-message")) {
        $("connection-message").textContent =
          "Respons database tidak valid";
      }
    };

    script.onerror = () => {
      cleanup();

      if ($("connection-message"))
        $("connection-message").textContent =
          "Koneksi database terputus";
    };

    script.src =
      `${endpoint}?action=read&callback=${callback}&t=${Date.now()}`;

    document.head.appendChild(script);

    setTimeout(() => {
      if (!done) {
        cleanup();

        if ($("connection-message"))
          $("connection-message").textContent =
            "Waktu koneksi habis";
      }
    }, 12000);
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  refresh();

  // Sinkronisasi setiap 30 detik.
  window.setInterval(refresh, 30000);

})();
