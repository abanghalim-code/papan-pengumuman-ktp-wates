# Papan Pengumuman Digital KTP-EL — Kecamatan Wates

Paket ini berisi halaman publik, halaman admin, dan Google Apps Script untuk mengelola empat status pelayanan:
1. Ketersediaan keping KTP: Ada / Menunggu Pengiriman
2. Jumlah keping KTP
3. Kondisi jaringan internet: Normal / Gangguan
4. Kondisi jaringan SIAK: Normal / Gangguan

Ketentuan pencetakan KTP dan kontak Mas Iwan ditampilkan tetap pada halaman publik.

## Isi paket
- `index.html` — halaman papan pengumuman untuk masyarakat
- `admin.html` — halaman pengelolaan status
- `styles.css` — desain responsif
- `config.js` — tempat memasang URL Google Apps Script
- `app.js` — pembaca data dan pembaruan otomatis 30 detik
- `admin.js` — pengirim perubahan dari halaman admin
- `Code.gs` — backend Google Apps Script

## A. Siapkan Google Sheets
1. Buat Google Sheets baru, misalnya `DATA PAPAN KTP WATES`.
2. Dari menu **Ekstensi > Apps Script**, buka editor Apps Script.
3. Hapus kode contoh, lalu salin seluruh isi file `Code.gs` ke editor.
4. Simpan proyek.
5. Pilih fungsi `setupSheet` lalu klik **Run/Jalankan**.
6. Setujui permintaan izin Google. Fungsi ini membuat sheet `Status KTP-EL` dan mengisi data awal: Menunggu Pengiriman, 100, Normal, Normal.

## B. Buat kode akses admin
1. Di Apps Script buka **Project Settings / Setelan project**.
2. Pada **Script Properties**, pilih **Add script property**.
3. Isi:
   - Property: `ADMIN_TOKEN`
   - Value: buat kode rahasia yang panjang dan unik. Jangan gunakan contoh umum.
4. Simpan. Jangan membagikan kode ini dan jangan memasukkannya ke `config.js`.

## C. Deploy Apps Script sebagai Web App
1. Klik **Deploy > New deployment**.
2. Pilih jenis **Web app**.
3. Description: `Papan Pengumuman KTP-EL Wates`.
4. Execute as: **Me**.
5. Who has access: **Anyone** (halaman publik perlu membaca data tanpa login).
6. Klik **Deploy**, setujui otorisasi, lalu salin URL Web App yang berakhiran `/exec`.
7. Jika kode Apps Script diubah setelah deployment, buka **Deploy > Manage deployments > Edit**, pilih versi baru, lalu deploy kembali.

Catatan: endpoint baca memang publik agar papan bisa dilihat masyarakat. Endpoint tulis dilindungi kode `ADMIN_TOKEN`. Gunakan kode acak yang kuat dan jangan memasukkannya ke berkas website.

## D. Hubungkan website
1. Buka `config.js`.
2. Ganti teks `TEMPEL_URL_WEB_APP_GOOGLE_APPS_SCRIPT_DI_SINI` dengan URL `/exec` dari langkah C.
3. Simpan.

## E. Pasang ke GitHub Pages
1. Unggah seluruh file paket ini ke folder/repository website GitHub Pages.
2. Jika ingin berada di subfolder, misalnya `/papan-ktp/`, unggah semua file ke folder tersebut.
3. Halaman publik: `https://NAMA-USER.github.io/NAMA-REPO/papan-ktp/` (sesuaikan alamat repository).
4. Halaman admin: `https://NAMA-USER.github.io/NAMA-REPO/papan-ktp/admin.html`.
5. Simpan alamat admin hanya untuk petugas yang berwenang.

## F. Uji coba
1. Buka halaman publik. Data awal akan terbaca dari Google Sheets.
2. Buka halaman admin.
3. Masukkan kode `ADMIN_TOKEN` yang disimpan pada Script Properties.
4. Ubah salah satu status dan klik **Simpan perubahan**.
5. Tunggu beberapa detik, lalu periksa halaman publik. Halaman publik memuat ulang data otomatis setiap 30 detik.

Penting: halaman admin mengirim permintaan lintas domain dengan mode `no-cors`; browser tidak dapat membaca balasan server. Karena itu, pesan admin menyatakan permintaan telah dikirim, bukan mengklaim server pasti berhasil menyimpan. Selalu verifikasi hasilnya pada halaman publik/Google Sheets.

## G. Penyesuaian identitas
- Logo/identitas visual dapat disesuaikan pada `index.html` dan `styles.css`.
- Nomor kontak Mas Iwan dan ketentuan pencetakan saat ini ditampilkan tetap di `index.html`.
- Data status yang dapat diubah hanya empat kolom pada Google Sheets.

## Catatan keamanan dan operasional
- Jangan pernah mengunggah `ADMIN_TOKEN` ke GitHub.
- Batasi akses edit Google Sheets kepada petugas yang berwenang.
- Siapa pun dapat membaca status yang memang ditujukan untuk publik.
- Uji terlebih dahulu menggunakan data non-kritis sebelum dipasang pada layar pelayanan.
- Untuk penggunaan resmi, sebaiknya admin memakai kode rahasia kuat dan diganti jika diketahui pihak yang tidak berwenang.
