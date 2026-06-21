# 基礎 (Kiso) - Aplikasi Web Belajar Bahasa Jepang 🇯🇵

![Version](https://img.shields.io/badge/version-1.4.1%20Yokohama-8b5cf6?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA-10b981?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JS-3b82f6?style=for-the-badge)

**Kiso (基礎)** adalah aplikasi berbasis web interaktif (PWA-ready) yang dirancang untuk membantu pembelajar bahasa Jepang menguasai materi dasar JLPT N5 dan N4. Aplikasi ini berfokus pada pengalaman pengguna yang cepat, bersih, dan menyediakan sistem evaluasi mandiri tanpa memerlukan backend database yang rumit.

---

## ✨ Fitur Utama

- 📖 **Mode Belajar (Flashcards)**
  Pelajari kosakata berdasarkan bab (Minna no Nihongo) menggunakan kartu interaktif. Mendukung mode evaluasi (Benar/Salah) maupun navigasi bebas (Maju/Mundur). Tampilan depan kartu bisa diatur menjadi Kanji, Kana, atau Arti.
- 📝 **Mode Ujian Terstruktur**
  Uji kemampuan hafalan dengan soal pilihan ganda. Dilengkapi dengan pengaturan tingkat kesulitan, mode acak/terjemahan, batas waktu (timer), dan skor hasil akhir.
- 漢字 **Kamus Kanji N5 & N4**
  Direktori lengkap karakter Kanji dengan informasi *Kunyomi*, *Onyomi*, arti, serta contoh kalimat penggunaannya.
- 文法 **Tata Bahasa (Bunpou)**
  Penjelasan komprehensif mengenai tata bahasa Jepang dari Bab 1 hingga 25.
  🔊 **Dilengkapi Text-to-Speech (TTS):** Dengarkan pelafalan asli dari setiap contoh kalimat bahasa Jepang langsung dengan satu klik.
- 📊 **Statistik & Pelacakan Progres**
  Pantau perkembangan belajarmu! Terdapat kalender *Heatmap* untuk melacak aktivitas harian (mirip GitHub), grafik retensi flashcard, histori nilai ujian, dan fitur Export data ke PDF.
- 🔍 **Pencarian Global & Favorit**
  Cari Kotoba atau Kanji secara instan dari menu manapun, serta simpan item penting ke dalam daftar "Favorit" untuk dipelajari kembali nanti.
- ⚙️ **Kustomisasi UI Lanjutan**
  Mendukung *Dark Mode* dan *Light Mode*. Pengguna juga dapat mengubah skala DPI (tampilan sistem), ukuran font teks keseluruhan, dan ukuran teks spesifik pada Flashcard.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini murni berjalan di sisi klien (Client-Side) sehingga sangat ringan dan dapat di-host secara statis.

- **Frontend:** HTML5, CSS3 (Native Variables, Grid/Flexbox), Vanilla JavaScript (ES6).
- **PWA (Progressive Web App):** Mendukung instalasi ke *homescreen* berkat konfigurasi `manifest.json` dan Service Worker (`sw.js`).
- **Storage:** LocalStorage API (untuk menyimpan *history*, statistik, pengaturan pengguna, dan favorit).
- **Library Eksternal:** 
  - `Chart.js` (Visualisasi data statistik)
  - `html2pdf.js` (Export laporan ke PDF)
- **API Eksternal:** Google Translate TTS API (untuk *voice pronunciation*).

---

## 🚀 Cara Menjalankan secara Lokal

Aplikasi ini menggunakan `fetch()` API untuk memuat data materi dari file `.txt` lokal. Oleh karena itu, aplikasi **tidak bisa** dijalankan hanya dengan klik dua kali pada file `index.html` (akan memicu *CORS/Cross-Origin error* di browser).

**Langkah-langkah instalasi:**

1. Clone repositori ini ke komputer kamu:
```bash
   git clone [https://github.com/zourryy/kiso.git](https://github.com/zourryy/kiso.git)