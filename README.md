# ibedes

Website resmi ibedes, studio digital asal Bandung yang meracik pengalaman web humanis untuk brand dan pelaku usaha. Proyek ini dibangun menggunakan [Astro 5](https://astro.build/), React untuk komponen interaktif, serta Tailwind CSS untuk styling sehingga ringan namun tetap fleksibel untuk dikembangkan.

## Teknologi utama
- [Astro](https://astro.build/) untuk routing, rendering konten Markdown, dan optimasi build.
- [React](https://react.dev/) + @astrojs/react untuk komponen yang butuh interaktivitas (mis. PWA installer).
- [Tailwind CSS](https://tailwindcss.com/) + gaya kustom di `src/styles/global.css`.
- Service worker kustom pada `public/sw.js` untuk cache offline dan instalasi PWA.

## Prasyarat
- Node.js 18 atau yang lebih baru.
- NPM (atau package manager lain) untuk mengelola dependensi.

## Menjalankan secara lokal
```bash
# Instal dependensi
npm install

# Mode pengembangan dengan HMR
npm run dev

# Build produksi
npm run build

# Pratinjau hasil build
npm run preview
```
Astro akan menampilkan URL lokal di terminal. Gunakan opsi `--host` (mis. `npm run dev -- --host`) bila ingin diuji dari perangkat lain.

## Struktur konten
- `src/pages/` menyimpan halaman Astro dan Markdown. Semua entri blog berada di `src/pages/blog/` sedangkan projek berada di `src/pages/projects/`.
- `src/layouts/ProjectLayout.astro` dan `src/layouts/BlogLayout.astro` menentukan struktur tiap entri konten.
- Komponen reusable berada di `src/components/`.

## Konfigurasi & kustomisasi
- **Copy global**: sunting `src/lib/variables.ts` untuk mengganti deskripsi singkat, nama menu, serta metadata blog/projek.
- **Produk/affiliate**: data kartu rekomendasi berada di `src/lib/products.ts`.
- **Asset PWA**: ikon, manifest, dan service worker berada di folder `public/`.
- **Integrasi analytics**: kode GA4 berada di `src/layouts/Layout.astro`. Ganti ID `G-TQ2GF3GCCX` bila diperlukan.

## Deploy
Hasil `npm run build` menghasilkan berkas statis di folder `dist/`. Upload ke hosting statis apa pun (Netlify, Vercel, Cloudflare Pages, dsb.) atau server sendiri.
