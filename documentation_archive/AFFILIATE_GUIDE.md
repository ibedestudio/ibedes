# Panduan Sistem Affiliate Link - ibedes.xyz

## 📝 Overview

Sistem affiliate link sudah terintegrasi di website kamu! Setiap artikel bisa menampilkan produk rekomendasi yang relevan dari Shopee, Tokopedia, dan platform lainnya.

## 🗂️ Struktur File

```
src/lib/affiliates.ts          # Database produk & artikel mapping
src/components/AffiliateProducts.astro  # Komponen tampilan
src/layouts/BlogLayout.astro   # Integration ke artikel
```

## 🎯 Cara Menambah Produk Affiliate

Ada dua cara untuk menampilkan produk affiliate di artikel:

### Cara 1: Menggunakan Frontmatter (Recommended)

Ini cara paling mudah. Cukup tambahkan ID produk di bagian atas file markdown artikel kamu.

```yaml
---
title: "Judul Artikel Kamu"
description: "Deskripsi artikel..."
affiliateProducts: 
  - "produk-id-1"
  - "produk-id-2"
affiliateContext: "Rekomendasi Produk Pilihan:"
---
```

### Cara 2: Menggunakan Mapping File (Legacy)

Edit file `src/lib/affiliates.ts`, tambahkan produk baru ke array `affiliateProducts` dan mapping di `articleAffiliates`.

#### 1. Tambah Produk Baru
Di `src/lib/affiliates.ts`:

```typescript
{
    id: 'jas-hujan-sp1',
    name: 'Jas Hujan Setelan Pria Wanita Anti Rembes Tebal
',
    description: 'Deskripsi produk yang helpful',
    price: 'Rp 80.000',
    originalPrice: '-', // Optional, untuk show discount
    discount: '-', // Optional
    image: 'https://down-tx-id.img.susercontent.com/id-11134207-7rbk1-majvemtwdal586.webp',
    link: 'https://s.shopee.co.id/6fZetdnADp',
    platform: 'shopee', // shopee, tokopedia, lazada, blibli, tiktok, amazon, other
    category: 'Productivity', // Kategori produk
    tags: ['tag1', 'tag2', 'relevant'], // Tags untuk matching
    rating: 4.8, // Optional
    verified: true // Set true kalau udah dicek/rekomendasi
}
```

#### 2. Mapping Produk ke Artikel (Jika tidak pakai Frontmatter)
Di array `articleAffiliates`:

```typescript
{
    articleSlug: 'slug-artikel-kamu',
    context: 'Context yang menjelaskan kenapa produk ini direkomendasikan:',
    productIds: ['id-produk1', 'id-produk2']
}
```

## 🏪 Platform yang Didukung

- **shopee** 🛒 - Warna merah (#EE4D2D)
- **tokopedia** 🛍️ - Warna hijau (#42B549)  
- **lazada** 🛒 - Warna biru (#0F1471)
- **blibli** 👜 - Warna biru muda (#0095DA) **(NEW)**
- **tiktok** 🎵 - Warna hitam (#000000) **(NEW)**
- **amazon** 📦 - Warna orange (#FF9900)
- **other** 🔗 - Warna abu-abu (#6B7280)

## 📱 Contoh Implementasi

### Di Markdown (Frontmatter):
```yaml
---
title: "Review Gadget Terbaru"
affiliateProducts:
  - "blibli-gadget"
  - "tiktok-skincare"
affiliateContext: "Beli gadget ini di official store:"
---
```

## 🎨 Styling & Appearance

Komponen `AffiliateProducts` sudah include:
- ✅ Responsive design (mobile-friendly)
- ✅ Platform badges dengan warna sesuai
- ✅ Discount badges
- ✅ Rating stars
- ✅ Hover effects
- ✅ Legal disclosure text
- ✅ Google Analytics tracking

## 📊 Analytics & Tracking

Setiap klik affiliate link otomatis ter-track:
- Product ID
- Platform 
- Value (1)

Check console browser untuk melihat events yang ter-push.

## ⚖️ Legal Compliance

Sudah include disclosure text otomatis:
```
⚠️ Disclosure: Some links in this section are affiliate links. 
If you make a purchase through these links, I may earn a small 
commission at no extra cost to you. This helps support the blog...
```

## � Quick Start

1. **Tambah produk baru:** Edit `affiliateProducts` array di `src/lib/affiliates.ts`
2. **Pasang di artikel:** Tambahkan `affiliateProducts` list di frontmatter artikel kamu.
3. **Test:** Buka artikel, cek apakah produk muncul
4. **Optimasi:** Monitor clicks dan conversion

## 📞 Support

Kalau ada pertanyaan atau butuh bantuan setup lebih lanjut, feel free to ask!

---
*Last updated: November 2025*