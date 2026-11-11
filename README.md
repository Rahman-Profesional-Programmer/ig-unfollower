# Instagram Auto Unfollower

Browser extension sederhana untuk membantu mengelola akun yang diikuti melalui antarmuka Instagram. Popup mendukung Bahasa Indonesia dan English.

> **Catatan:** Target 200 unfollow per hari hanyalah anjuran di dalam aplikasi, bukan batas harian otomatis atau jaminan keamanan akun. Instagram dapat mengubah antarmuka dan batas penggunaannya. Otomatisasi dapat terkena pembatasan atau tidak sesuai dengan ketentuan platform. Gunakan dengan pertimbangan Anda sendiri.

## Fitur

- Target total unfollow yang dapat diatur (default: 200).
- Rentang jeda acak antar aksi dalam **detik** (default: 10–15 detik).
- Cooldown setelah sejumlah unfollow berhasil (default: setiap 9 akun, istirahat 10 menit).
- Jeda sebelum mencoba lagi ketika proses gagal (default: 30 menit).
- Hitung mundur ke aksi berikutnya dan durasi proses.
- Tombol **Stop** untuk menghentikan proses.
- Pilihan antarmuka Bahasa Indonesia dan English.

## Instalasi di Chrome

1. Unduh atau clone repository ini ke komputer.
2. Buka `chrome://extensions` di Chrome.
3. Aktifkan **Developer mode**.
4. Klik **Load unpacked**.
5. Pilih folder project yang berisi `manifest.json`.
6. Pin extension melalui menu Extensions jika ingin akses lebih mudah.

Untuk memuat perubahan setelah mengedit file, kembali ke `chrome://extensions` lalu klik tombol **Reload** pada extension.

## Cara menggunakan

1. Buka Instagram dan masuk ke halaman daftar akun yang Anda ikuti.
2. Klik ikon extension.
3. Atur target, jeda minimum dan maksimum, cooldown, serta jeda saat proses gagal.
4. Klik **Mulai / Start**.
5. Popup menampilkan status, hitung mundur, dan lama proses. Klik **Stop** untuk menghentikannya.

### Pengaturan

| Pengaturan | Keterangan | Default |
|---|---|---:|
| Target total unfollow | Maksimum aksi yang ditargetkan dalam satu proses | 200 |
| Rentang jeda (detik) | Jeda acak antar aksi; nilai maksimum harus sama dengan atau lebih besar dari minimum | 10–15 detik |
| Setiap … akun | Jumlah aksi berhasil sebelum cooldown | 9 |
| Istirahat selama | Durasi cooldown | 10 menit |
| Jeda saat gagal | Waktu tunggu sebelum mencoba kembali setelah interaksi gagal | 30 menit |

Nilai jeda antar aksi harus berupa bilangan bulat positif. Durasi cooldown dan jeda saat gagal diatur dalam menit. Popup menolak nilai yang melampaui batas timer browser.

## Batasan dan pemecahan masalah

- Extension bekerja berdasarkan elemen tombol yang terlihat di halaman Instagram dan label dalam Bahasa Inggris atau Indonesia. Perubahan desain atau teks Instagram dapat membuat proses tidak menemukan tombol.
- Buka daftar akun yang diikuti sebelum memulai. Jika tombol tidak ditemukan, proses akan mencoba menggulir halaman dan mencari lagi.
- Proses berjalan pada tab Instagram tempat Anda memulainya. Memuat ulang atau menutup tab dapat menghentikan proses dan menghapus status sementara.
- Jika popup menampilkan error, pastikan tab aktif berada di `instagram.com`, lalu muat ulang extension melalui `chrome://extensions`.
- Jeda tidak menjamin tindakan akan diterima oleh Instagram atau akun bebas dari pembatasan.

## Berkas project

- `manifest.json` — konfigurasi extension Manifest V3.
- `popup.html` — antarmuka popup.
- `popup.js` — pengaturan, terjemahan, dan logika popup/proses.
- `content.js` — berkas content script yang saat ini kosong dan tidak dirujuk oleh manifest.
- `icon.png` — ikon extension.

---

# Instagram Auto Unfollower (English)

A simple browser extension to help manage followed accounts through Instagram's interface. The popup is available in Indonesian and English.

> **Note:** The suggested target of 200 unfollows per day is informational only. The extension does not enforce a daily limit or guarantee account safety. Instagram may change its interface and usage limits. Automation may be restricted or may not comply with the platform's terms. Use at your own discretion.

## Features

- Configurable total unfollow target (default: 200).
- Random delay range between actions in **seconds** (default: 10–15 seconds).
- Cooldown after a configured number of successful unfollows (default: every 9 accounts, rest for 10 minutes).
- Pause before retrying when an interaction fails (default: 30 minutes).
- Countdown to the next action and elapsed process time.
- **Stop** button to halt the process.
- Indonesian and English interface.

## Install in Chrome

1. Download or clone this repository to your computer.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project folder containing `manifest.json`.
6. Pin the extension from the Extensions menu for easier access.

After editing the files, return to `chrome://extensions` and click the extension's **Reload** button to apply changes.

## Usage

1. Open Instagram and navigate to the list of accounts you follow.
2. Click the extension icon.
3. Set the target, minimum and maximum delays, cooldown, and failure pause.
4. Click **Mulai / Start**.
5. The popup shows the status, countdown, and elapsed time. Click **Stop** to halt the process.

### Settings

| Setting | Description | Default |
|---|---|---:|
| Total unfollow target | Maximum number of actions targeted in one run | 200 |
| Delay range (seconds) | Random delay between actions; maximum must be greater than or equal to minimum | 10–15 seconds |
| For every … users | Number of successful actions before a cooldown | 9 |
| Cooldown duration | Length of the cooldown | 10 minutes |
| Failure pause | Time to wait before retrying after an interaction fails | 30 minutes |

Action delay values must be positive whole numbers. Cooldown and failure pause are configured in minutes. The popup rejects durations that exceed the browser timer limit.

## Limitations and troubleshooting

- The extension relies on buttons visible in Instagram's page and labels in English or Indonesian. Instagram UI or text changes may prevent it from finding the expected buttons.
- Open the followed-accounts list before starting. If no button is found, the process will try scrolling and searching again.
- The process runs in the Instagram tab where it was started. Reloading or closing that tab may stop the process and clear its temporary status.
- If the popup shows an error, make sure the active tab is on `instagram.com`, then reload the extension from `chrome://extensions`.
- Delays cannot guarantee that Instagram will accept an action or that an account will avoid restrictions.

## Project files

- `manifest.json` — Manifest V3 extension configuration.
- `popup.html` — popup interface.
- `popup.js` — settings, translations, and popup/process logic.
- `content.js` — currently empty content-script file, not referenced by the manifest.
- `icon.png` — extension icon.
