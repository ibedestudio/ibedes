export type AffiliateLink = {
  label: string;
  url: string;
  note?: string;
};

export type AffiliateProduct = {
  slug: string;
  title: string;
  description: string;
  category: string;
  highlight?: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
  links: AffiliateLink[];
};

/**
 * Tambahkan produk affiliate kamu di sini.
 * Cukup copy-paste link Shopee / Tokopedia / TikTok Shop ke field `url`.
 */
export const PRODUCTS: AffiliateProduct[] = [
  {
    slug: "markaz-hunter-shopee-kit",
    title: "Kit Shopee Markaz Hunter",
    category: "Shopee Picks",
    highlight: "Link-link Shopee favorit komunitas — tinggal pilih yang paling sesuai promo.",
    description:
      "Satu tempat buat semua link Shopee terbaru yang sering kutanya penonton YouTube, IG, dan newsletter. Simpan halaman ini biar gampang cari kode dukungan tanpa DM satu-satu.",
    image:
      "https://images.unsplash.com/photo-1505740106531-4243f3831c78?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Headphone oranye di atas meja, menggambarkan suasana kurasi favorit",
    tags: ["affiliate", "shopee", "community"],
    links: [
      {
        label: "Shopee #1",
        url: "https://s.shopee.co.id/9fD3a5ddu2",
        note: "Link utama — paling sering kupakai di IG Story",
      },
      {
        label: "Shopee #2",
        url: "https://s.shopee.co.id/7AVibWqgPB",
        note: "Cadangan kalau link utama lagi full traffic",
      },
      {
        label: "Shopee #3",
        url: "https://s.shopee.co.id/10v5GF4DU3",
        note: "Kurasi alat belajar & workspace upgrade",
      },
      {
        label: "Shopee #4",
        url: "https://s.shopee.co.id/8V16C3jrWe",
        note: "Self-care + hadiah kecil favorit",
      },
      {
        label: "Shopee #5",
        url: "https://s.shopee.co.id/7fRzCZUDx5",
        note: "Stationery & journaling pick",
      },
      {
        label: "Shopee #6",
        url: "https://s.shopee.co.id/6VG1oPzsdG",
        note: "Request khusus dari subscribers",
      },
    ],
  },
  {
    slug: "soundcore-r50i-nc",
    title: "Soundcore Anker R50i NC",
    category: "Audio & Wearables",
    highlight: "Adaptive ANC + low latency mode buat sesi game mobile.",
    description:
      "Earbuds TWS yang ringan dengan Bluetooth 5.4, 4 mikrofon, dan baterai sampai 45 jam. Cocok buat commuting, call, atau push rank tanpa delay.",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Earbuds hitam berada di atas permukaan marmer",
    tags: ["earbuds", "noise-canceling", "low-latency"],
    links: [
      {
        label: "Tokopedia",
        url: "https://vt.tokopedia.com/t/ZSH3rrusXsYeB-pM0BJ/",
        note: "Launch terbaru + bonus adaptor eartips",
      },
    ],
  },
  {
    slug: "mirrorspace-3-wireless-case",
    title: "MirrorSpace 3 Wireless Charging Case",
    category: "Audio & Wearables",
    highlight: "Case TWS dengan wireless charging + indikator LED stylish.",
    description:
      "Upgrade Dock earbud kamu tanpa ganti unit. Tinggal pairing ulang, dapat port USB-C, wireless charging, dan cover glossy anti gores.",
    tags: ["tws", "charging", "usb-c"],
    links: [
      {
        label: "Tokopedia",
        url: "https://vt.tokopedia.com/t/ZSH3rrGjaxuw3-Ok6vo/",
        note: "Varian warna lengkap + ready stok",
      },
    ],
  },
  {
    slug: "jas-hujan-hoody-pvc025",
    title: "Jas Hujan Hoodie PVC 0.25",
    category: "Outdoor & Mobility",
    highlight: "Model hoodie tanpa resleting, tebal, aman buat riding harian.",
    description:
      "Setelan atas-bawah dengan bahan PVC 0.25 mm, lapisan dobel, dan potongan oversized biar gerak tetap leluasa. Favorit tim commuter karena gampang dilipat.",
    tags: ["rain-gear", "commute"],
    links: [
      {
        label: "Tokopedia #1",
        url: "https://vt.tokopedia.com/t/ZSH3rr7QNJ2Uw-ZWMgh/",
        note: "Model hoodie tanpa zipper",
      },
      {
        label: "Tokopedia #2",
        url: "https://vt.tokopedia.com/t/ZSH3rrTTgJU9x-5yNae/",
        note: "Pilihan warna lengkap",
      },
      {
        label: "Tokopedia #3",
        url: "https://vt.tokopedia.com/t/ZSH3rh2d39Rw9-dc6kH/",
        note: "Full seal press anti rembes",
      },
    ],
  },
  {
    slug: "jas-hujan-ransel-hoodie",
    title: "Jas Hujan Hoodie + Kompartemen Ransel",
    category: "Outdoor & Mobility",
    highlight: "Bagian punggung expandable — muat ransel kerja.",
    description:
      "Setelan dewasa berbahan impor waterproof dengan hoodie pelindung kepala. Ada gusset di belakang supaya tas tetap kering saat riding jauh.",
    tags: ["rain-gear", "motor", "daily-carry"],
    links: [
      {
        label: "Tokopedia",
        url: "https://vt.tokopedia.com/t/ZSH3rr3U8pdqH-u2UWv/",
        note: "Size L s.d XXL",
      },
    ],
  },
  {
    slug: "advan-tbook-n100",
    title: "ADVAN TBOOK Intel N100",
    category: "Laptop & Produktivitas",
    highlight: "Laptop 14\" ringan dengan Intel N100 + storage 128GB.",
    description:
      "Notebook ekonomis buat nulis, meeting online, dan akses dokumen cloud. Sudah termasuk Windows 11 dan bisa upgrade storage via slot M.2.",
    tags: ["laptop-tipis", "budget-setup"],
    links: [
      {
        label: "Tokopedia",
        url: "https://vt.tokopedia.com/t/ZSH3rro3wamtb-mgLLY/",
        note: "Bonus tas sleeve & mouse",
      },
    ],
  },
  {
    slug: "hp-ryzen3-essential-14",
    title: "HP Ryzen 3 Essential 14\"",
    category: "Laptop & Produktivitas",
    highlight: "Ryzen 3 + SSD 512GB buat kuliah dan kerja ringan.",
    description:
      "Pilihan aman kalau kamu butuh laptop branded dengan garansi resmi 2 tahun, RAM 8GB, dan layar 14\" beresolusi HD. Ready warna Gold & Silver.",
    tags: ["laptop", "work-from-anywhere"],
    links: [
      {
        label: "Tokopedia",
        url: "https://vt.tokopedia.com/t/ZSH3rherEGfgS-MuZi8/",
        note: "Paket Windows 11 Home",
      },
    ],
  },
  {
    slug: "senter-led-zoom-90000",
    title: "Senter LED 90.000 Lumens USB-C",
    category: "Outdoor & Mobility",
    highlight: "Super terang + baterai 26650 rechargeable.",
    description:
      "Flashlight tahan air dengan mode zoom dan port USB-C. Cocok dibawa camping atau disimpan di bagasi motor buat keadaan darurat.",
    tags: ["outdoor", "emergency"],
    links: [
      {
        label: "Tokopedia",
        url: "https://vt.tokopedia.com/t/ZSH3rhM27aCed-3uxYd/",
        note: "Include baterai + kabel",
      },
    ],
  },
  {
    slug: "kindle-scribe",
    title: "Kindle Scribe 16GB",
    category: "Belajar & Menulis",
    highlight: "Notebook digital + e-reader bebas distraksi",
    description:
      "Perpaduan e-reader dan buku catatan digital, enak buat review materi atau journaling tanpa buka sosmed.",
    image:
      "https://images.unsplash.com/photo-1513477967668-2aaf11838bd3?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Kindle e-reader di meja kayu",
    tags: ["fokus", "belajar mandiri"],
    links: [
      {
        label: "Shopee",
        url: "https://s.shopee.co.id/4foNWZEQoy",
        note: "Sering ada cashback ongkir",
      },
      {
        label: "Tokopedia",
        url: "https://tokopedia.link/affiliate-link-kindle",
      },
    ],
  },
  {
    slug: "dicoding-elevate",
    title: "Dicoding Elevate: Product & Tech Mastery",
    category: "Kelas & Sertifikasi",
    highlight: "Belajar langsung dari fasilitator Dicoding + akses komunitas profesional.",
    description:
      "Program intensif buat upgrade skill digital / product management. Cocok kalau kamu lagi nyiapin karier baru atau butuh kurikulum terstruktur dengan mentor.",
    image: "/images/microsoft_dicoding.jpg",
    imageAlt: "Poster Dicoding Elevate kolaborasi Microsoft",
    tags: ["career-switch", "learning"],
    links: [
      {
        label: "Daftar via Dicoding",
        url: "https://dicoding.com/elevate/registration?referrer_id=4500153",
        note: "Pakai link referral ibedes",
      },
    ],
  },
  {
    slug: "lp6-pen-tablet",
    title: "XP-Pen Deco Mini",
    category: "Kreativitas",
    highlight: "Tablet gambar mungil buat sketsa ide cepat",
    description:
      "Pas dipakai untuk mind mapping, sketsa UI, atau ngajarin anak gambar tanpa boros kertas.",
    tags: ["kreator", "mengajar"],
    links: [
      {
        label: "TikTok Shop",
        url: "https://www.tiktok.com/affiliate-link-xppen",
        note: "Biasanya bundling sama nib cadangan",
      },
      {
        label: "Shopee",
        url: "https://shope.ee/affiliate-link-xppen",
      },
    ],
  },
];
