<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#B7E94A">
  <title>REPUBLIK MELON | Kecamatan Wates</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    /* Perbaikan tampilan: mencegah panel saling bertumpuk */
    @media (min-width:761px) {
      html, body {height:100%; overflow:hidden}
      .public-page {height:100vh; min-height:0; overflow:hidden; padding:10px 14px}
      .melon-board {height:100%; min-height:0; gap:8px; padding:12px; overflow:hidden}
      .topbar {flex:0 0 12%; min-height:76px}
      .main-grid {
        flex:1 1 0; min-height:0;
        grid-template-columns:minmax(0,1.72fr) minmax(300px,.9fr);
        gap:12px;
      }
      .service-area {
        display:flex !important; flex-direction:column;
        min-height:0; gap:9px; overflow:hidden;
      }
      .service-hero {flex:1 1 auto; min-height:145px; height:auto}
      .network-grid {
        flex:0 0 68px; min-height:68px;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:10px; overflow:hidden;
      }
      .network-card {
        min-width:0; min-height:0; height:68px;
        padding:8px 12px; overflow:hidden !important;
        position:relative; isolation:isolate;
      }
      /* Ikon internet dan SIAK dibuat kecil dan dibatasi di kotaknya */
      .network-symbol {
        width:34px !important; height:34px !important;
        min-width:34px !important; flex:0 0 34px !important;
        padding:5px !important; border-radius:9px;
        display:grid; place-items:center; overflow:hidden !important;
        position:relative; z-index:1;
      }
      .network-symbol img, .network-symbol svg {
        display:block !important;
        width:22px !important; height:22px !important;
        min-width:22px !important; min-height:22px !important;
        max-width:22px !important; max-height:22px !important;
        object-fit:contain !important; position:static !important;
        transform:none !important;
      }
      .network-card > div:nth-child(2) {min-width:0; flex:1}
      .network-state {line-height:1.1}
      .service-note {
        flex:0 0 auto; min-height:42px; margin:0;
        position:relative; z-index:2;
      }
      .official-area {min-height:0; overflow:hidden}
      .official-list {min-height:0}
      .market-area {flex:0 0 18%; min-height:100px; overflow:hidden}
      .market-grid {min-height:0}
      .bottomline {flex:0 0 auto; min-height:30px; overflow:hidden}
    }
    @media (min-width:761px) and (max-height:760px) {
      .service-hero {min-height:120px}
      .network-grid {flex-basis:62px; min-height:62px}
      .network-card {height:62px}
      .network-symbol {width:32px !important;height:32px !important;min-width:32px !important;flex-basis:32px !important}
      .network-symbol img,.network-symbol svg {
        width:20px !important;height:20px !important;
        min-width:20px !important;min-height:20px !important;
        max-width:20px !important;max-height:20px !important
      }
      .market-area {flex-basis:17%;min-height:90px}
    }
    @media (max-width:760px) {
      .service-area {overflow:visible}
      .network-card {overflow:hidden !important;min-height:68px}
      .network-symbol {
        width:34px !important;height:34px !important;
        min-width:34px !important;flex:0 0 34px !important;
        padding:5px !important;overflow:hidden !important
      }
      .network-symbol img,.network-symbol svg {
        width:22px !important;height:22px !important;
        min-width:22px !important;min-height:22px !important;
        max-width:22px !important;max-height:22px !important;
        object-fit:contain !important;position:static !important;
        transform:none !important
      }
    }
  </style>
</head>
<body class="public-page">
  <main class="melon-board">
    <header class="topbar">
      <div class="identity">
        <div class="crest-wrap melon-logo"><img src="assets/logo-republik-melon.png" alt="Logo REPUBLIK MELON Kecamatan Wates"></div>
        <div class="identity-copy">
          <div class="govline">PEMERINTAH KABUPATEN BLITAR</div>
          <h1>REPUBLIK <span>MELON</span></h1>
          <div class="office-line">PAPAN INFORMASI DIGITAL · KECAMATAN WATES</div>
        </div>
      </div>
      <div class="clockbox" aria-label="Tanggal dan waktu real time">
        <div class="clock-day" id="clock-day">SENIN · PON</div>
        <div class="clock-date" id="clock-date">14 November 2026</div>
        <div class="clock-time" id="clock-time">00:00:00</div>
      </div>
    </header>

    <section class="main-grid">
      <section class="service-area" aria-label="Informasi pelayanan">
        <div class="section-heading">
          <span class="heading-mark"></span>
          <div><p class="section-kicker">PUSAT INFORMASI MASYARAKAT</p><h2>INFORMASI PELAYANAN</h2></div>
          <span class="live-chip"><i></i> DATA TERKINI</span>
        </div>
        <div class="service-hero">
          <div class="service-title">
            <span class="mini-label">ADMINISTRASI KEPENDUDUKAN</span>
            <h3>Pelayanan Pencetakan<br>KTP Elektronik</h3>
            <p>Informasi ketersediaan blanko dan kesiapan sistem pelayanan Kecamatan Wates.</p>
          </div>
          <div class="availability">
            <div class="availability-label">STATUS KETERSEDIAAN KTP-EL</div>
            <div id="ktp-status" class="availability-value">Menunggu Pengiriman</div>
            <div class="availability-bottom">
              <span id="ktp-pill" class="status-pill warning">MENUNGGU PENGIRIMAN</span>
              <strong id="ktp-quantity">100 <small>KEPING</small></strong>
            </div>
          </div>
        </div>
        <div class="network-grid">
          <article class="network-card">
            <div class="network-symbol"><img src="assets/icon-internet.png" alt="Ikon jaringan internet"></div>
            <div><span class="card-caption">JARINGAN INTERNET</span><strong id="internet-status" class="network-state normal">Normal</strong></div>
            <span id="internet-pill" class="tiny-pill normal">NORMAL</span>
          </article>
          <article class="network-card">
            <div class="network-symbol network-symbol-siak"><img src="assets/icon-siak.jpg" alt="Ikon jaringan SIAK"></div>
            <div><span class="card-caption">SISTEM SIAK</span><strong id="siak-status" class="network-state normal">Normal</strong></div>
            <span id="siak-pill" class="tiny-pill normal">NORMAL</span>
          </article>
        </div>
        <div class="service-note">
          <b>INFO PENTING</b>
          <span>Pencetakan di Kecamatan Wates diperuntukkan bagi KTP-EL pemula. Pengurusan KTP hilang atau rusak dilayani di Dispendukcapil Kabupaten Blitar.</span>
        </div>
      </section>

      <aside class="official-area" aria-label="Status pejabat kecamatan">
        <div class="section-heading compact">
          <span class="heading-mark"></span>
          <div><p class="section-kicker">PELAYANAN DAN KOORDINASI</p><h2>STATUS PEJABAT</h2></div>
        </div>
        <div class="official-list">
          <div class="official-row"><span class="official-role">Camat</span><strong id="camat-status" class="official-status on">ADA</strong></div>
          <div class="official-row"><span class="official-role">Sekretaris Kecamatan</span><strong id="sekcam-status" class="official-status on">ADA</strong></div>
          <div class="official-row"><span class="official-role">Kasi Pemerintahan</span><strong id="kasipem-status" class="official-status on">ADA</strong></div>
          <div class="official-row"><span class="official-role">Kasi Pemberdayaan Masyarakat dan Desa</span><strong id="kasi_pmd-status" class="official-status on">ADA</strong></div>
          <div class="official-row"><span class="official-role">Kasi Kesejahteraan Sosial</span><strong id="kasi_kesos-status" class="official-status on">ADA</strong></div>
          <div class="official-row"><span class="official-role">Kasi Ketenteraman dan Ketertiban</span><strong id="kasi_trantib-status" class="official-status on">ADA</strong></div>
        </div>
        <div class="official-foot">Status keberadaan pejabat diperbarui oleh admin kecamatan.</div>
      </aside>
    </section>

    <section class="market-area" aria-label="Informasi hari pasaran pasar">
      <div class="market-heading">
        <div><p class="section-kicker">AGENDA PASAR WILAYAH KECAMATAN WATES</p><h2>INFO PASARAN</h2></div>
        <span class="market-subtitle">Jadwal pasaran masyarakat</span>
      </div>
      <div class="market-grid">
        <article class="market-card">
          <img src="assets/pasar-wates.jpg" alt="Foto Pasar Desa Wates">
          <div class="market-overlay"><span class="market-name">PASAR DESA WATES</span><strong>WAGE</strong><span class="market-coordinate">-8.252800, 112.377769</span></div>
        </article>
        <article class="market-card">
          <img src="assets/pasar-bantengan.jpg" alt="Foto Pasar Hewan Bantengan">
          <div class="market-overlay"><span class="market-name">PASAR HEWAN BANTENGAN</span><strong>KLIWON <em>•</em> PAHING</strong><span class="market-coordinate">-8.268670, 112.326074</span></div>
        </article>
      </div>
    </section>

    <footer class="bottomline">
      <div class="motto">INFORMASI JELAS · PELAYANAN BERKUALITAS</div>
      <div class="contact-info"><span>INFORMASI LEBIH LANJUT</span> <strong>Mas Iwan</strong> <a href="tel:+6282141809931">+62 821-4180-9931</a></div>
      <div class="update-stack">
        <div id="updated-at" class="updated-at">Terakhir diperbarui —</div>
        <div id="connection-message" class="connection-message">Menghubungkan database…</div>
      </div>
    </footer>
  </main>
  <script src="config.js"></script>
  <script src="app.js"></script>
</body>
</html>
