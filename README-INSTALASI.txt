REPUBLIK MELON — KECAMATAN WATES

PAKET BERISI
- index.html, styles.css, app.js: halaman publik REPUBLIK MELON.
- admin.html, admin.js: panel admin untuk data pelayanan dan 6 status pejabat.
- config.js: URL Apps Script yang sedang digunakan.
- Code.gs: versi backend Apps Script dengan 12 kolom dan riwayat pembaruan.
- assets/pasar-wates.jpg dan assets/pasar-bantengan.jpg: foto sesuai urutan yang diberikan.

PENTING — PASANG BERTAHAP, JANGAN HAPUS DATA
1. Di GitHub repository abanghalim-code/papan-pengumuman-ktp-wates, unggah/ganti index.html, styles.css, app.js, admin.html, admin.js, config.js, dan folder assets beserta dua foto JPG. Pertahankan nama file/folder persis.
2. Di Apps Script, buka file Kode.gs. Sebelum mengganti, salin/backup kode lama ke file teks pribadi.
3. Ganti isi Kode.gs dengan isi file Code.gs dari paket ini. Script menggunakan Spreadsheet ID dan nama sheet yang sama.
4. Simpan, pilih fungsi setupSheet, lalu klik Jalankan. Fungsi ini menambahkan kolom G-L dan mengisi status pejabat lama yang kosong dengan ADA. Baris data lama tidak dihapus.
5. Klik Terapkan > Kelola deployment > Edit (ikon pensil) > Versi baru > Terapkan. Pertahankan deployment Web App yang sama agar URL tetap sama.
6. Buka halaman admin, simpan satu uji perubahan, lalu periksa Google Sheets. Baris baru akan ditambahkan sebagai riwayat; dashboard publik membaca baris paling bawah/terbaru.
7. Buka halaman publik dan tekan Ctrl+F5 untuk memuat file terbaru.

URUTAN 12 KOLOM SHEET
A ktp_availability | B quantity | C internet | D siak | E updated_at | F by |
G camat_status | H sekcam_status | I kasipem_status | J kasi_pmd_status |
K kasi_kesos_status | L kasi_trantib_status

CATATAN
- Token admin tetap memakai Script Property bernama admin_token. Jangan kirim token ke chat atau masukkan ke GitHub.
- Halaman publik didesain untuk monitor landscape dan tinggi layar penuh. Di ponsel, layout berubah vertikal agar tetap terbaca.
- Pasaran harian memakai acuan kalender Jawa: 1 Januari 2024 = Senin Pahing.
- Logo Kabupaten Blitar belum disertakan sebagai file gambar pada paket ini. Bila ingin logo resmi tampil, unggah lambang sebagai assets/logo-blitar.png.
