export type ServicePriceTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

export type ServiceProcess = {
  title: string;
  description: string;
};

export type ServiceDetail = {
  slug: string;
  title: string;
  summary: string;
  intro: string;
  bestFor: string;
  problems: string[];
  priceList: ServicePriceTier[];
  benefits: string[];
  process: ServiceProcess[];
  extras?: string[];
};

export const SERVICES: ServiceDetail[] = [
  {
    slug: "social-media",
    title: "Manajemen Sosial Media",
    summary:
      "Tingkatkan engagement, jangkau pelanggan baru, dan buat brand kamu selalu aktif.",
    intro:
      "Kami bantu urus kalender konten, copywriting, sampai report performa supaya kamu fokus ke operasional bisnis.",
    bestFor: "UMKM, brand lokal, dan kreator yang butuh presence konsisten.",
    problems: [
      "Konten berhenti karena tim kecil",
      "Tidak ada guideline visual dan tone",
      "Engagement tidak naik meski rutin posting",
    ],
    priceList: [
      {
        name: "Presence Kit",
        price: "Mulai Rp2,5 juta / bulan",
        description: "Tampilan feed rapi dan tetap hidup setiap minggu.",
        features: [
          "8 konten feed + story per bulan",
          "Copywriting & hashtag research",
          "Basic report bulanan",
          "2 revisi konsep",
        ],
      },
      {
        name: "Growth Retainer",
        price: "Mulai Rp4,5 juta / bulan",
        description: "Optimalkan konten multi-format plus community management.",
        features: [
          "12 konten (feed, reels, carousel)",
          "Content planning & asset kit",
          "Community response 3x seminggu",
          "Performance deck detail",
        ],
        highlight: true,
      },
      {
        name: "Campaign Sprint",
        price: "Quote by brief",
        description: "Butuh kampanye musiman atau kolaborasi spesifik.",
        features: [
          "Creative concept & key visual",
          "Influencer shortlist + koordinasi",
          "Paid media suggestion",
          "Full recap & lesson learned",
        ],
      },
    ],
    benefits: [
      "Tone of voice dan guideline visual yang konsisten",
      "Konten kalender jelas untuk approve cepat",
      "Analisis performa yang mudah dicerna",
      "Koordinasi fleksibel via WhatsApp atau Notion",
    ],
    process: [
      {
        title: "Audit & positioning",
        description: "Review akun, tone brand, dan target audiens yang paling relevan.",
      },
      {
        title: "Content blueprint",
        description: "Susun rubrik konten, key message, dan jadwal produksi.",
      },
      {
        title: "Produksi & publish",
        description: "Desain, copywriting, layout, hingga unggah konten sesuai jadwal.",
      },
      {
        title: "Report & iterate",
        description: "Snapshot performa + rekomendasi aksi untuk bulan berikutnya.",
      },
    ],
  },
  {
    slug: "web-development",
    title: "Pembuatan Website",
    summary:
      "Website profesional dan user-friendly supaya produk atau jasa terlihat lebih kredibel.",
    intro:
      "Bangun landing page atau company profile dengan performa tinggi menggunakan stack modern (Astro + Tailwind).",
    bestFor: "Founder, agen kreatif, atau brand yang butuh rumah digital yang solid.",
    problems: [
      "Website lama lambat dan sulit di-update",
      "Belum punya struktur konten yang jelas",
      "Perlu integrasi form atau automation ringan",
    ],
    priceList: [
      {
        name: "Starter Landing",
        price: "Mulai Rp4,5 juta",
        description: "1 halaman fokus untuk kampanye atau validasi produk.",
        features: [
          "Desain kustom berbasis brand",
          "Copywriting ringan + ilustrasi aset",
          "Integrasi form WhatsApp / email",
          "Basic SEO & analytics setup",
        ],
      },
      {
        name: "Growth Website",
        price: "Mulai Rp8 juta",
        description: "Sampai 5 halaman dengan komponen reusable.",
        features: [
          "Multiple page (About, Services, Blog, dsb.)",
          "CMS ringan via Markdown / Notion",
          "Newsletter & automation hookup",
          "Optimasi performa + aksesibilitas",
        ],
        highlight: true,
      },
      {
        name: "Custom Build",
        price: "Quote by brief",
        description: "Kebutuhan khusus seperti dashboard, portal, atau integrasi API.",
        features: [
          "Workshop discovery",
          "Design system & token",
          "Integrasi data / API",
          "Support pasca rilis",
        ],
      },
    ],
    benefits: [
      "Stack modern untuk performa kilat",
      "Struktur konten rapi dan mudah diedit",
      "Kustomisasi penuh untuk brand",
      "Dokumentasi singkat setelah hand-off",
    ],
    process: [
      {
        title: "Discovery",
        description: "Diskusi target pengguna, konten utama, dan flow yang dibutuhkan.",
      },
      {
        title: "Blueprint",
        description: "Susun site map + wireframe langsung di kode supaya iterasi cepat.",
      },
      {
        title: "Design & build",
        description: "Implementasi visual, copy, dan integrasi pihak ketiga.",
      },
      {
        title: "Launch & hand-off",
        description: "Testing, optimasi, dan panduan update konten.",
      },
    ],
  },
  {
    slug: "digital-ads",
    title: "Periklanan Digital",
    summary:
      "Strategi iklan tepat sasaran untuk mendongkrak penjualan dengan budget yang terukur.",
    intro:
      "Kami bantu dari riset audiens, materi iklan, sampai optimasi harian supaya budget iklan tidak kebakar percuma.",
    bestFor: "Bisnis dengan produk jelas yang ingin scale lewat Meta Ads / Google Ads.",
    problems: [
      "CPC mahal tapi leads nihil",
      "Tidak ada funnel iklan yang rapi",
      "Butuh materi iklan yang konsisten",
    ],
    priceList: [
      {
        name: "Optimize",
        price: "Mulai Rp3 juta / kampanye",
        description: "Pasang iklan berbasis data untuk satu tujuan jelas (leads atau sales).",
        features: [
          "Audit pixel & event",
          "2 set materi iklan",
          "Monitoring + optimasi mingguan",
          "Laporan akhir kampanye",
        ],
      },
      {
        name: "Scale",
        price: "Mulai Rp5,5 juta / kampanye",
        description: "Pendampingan penuh selama 30 hari termasuk split-test kreatif.",
        features: [
          "Strategi funnel 3 lapis",
          "4 set materi (static + video)",
          "Daily check & adjustment",
          "Insight deck + rekomendasi lanjutan",
        ],
        highlight: true,
      },
      {
        name: "Performance Partner",
        price: "Retainer + revenue share",
        description: "Kerja bareng tim internal untuk scale lebih agresif.",
        features: [
          "Pemilihan channel terbaik",
          "Workshop internal",
          "Weekly war-room",
          "Custom dashboard",
        ],
      },
    ],
    benefits: [
      "Set up tracking rapi (pixel, event, conversion)",
      "Materi iklan disiapkan sesuai funnel",
      "Insight actionable, bukan sekadar angka",
      "Koordinasi langsung dengan satu PIC",
    ],
    process: [
      {
        title: "Funnel & offer",
        description: "Petakan produk, promo, dan target KPI.",
      },
      {
        title: "Creative kit",
        description: "Produksi materi iklan + copywriting sesuai persona.",
      },
      {
        title: "Launch & optimize",
        description: "Monitoring harian, adjust bid & audience.",
      },
      {
        title: "Report",
        description: "Analisis hasil + rekomendasi per channel.",
      },
    ],
  },
  {
    slug: "digital-marketing-consulting",
    title: "Konsultasi Digital Marketing",
    summary:
      "Diskusi santai untuk merancang roadmap pemasaran digital yang paling cocok dengan bisnismu.",
    intro:
      "Sesi konsultasi 1:1 untuk audit channel, tentukan prioritas, dan susun action plan yang realistis.",
    bestFor: "Owner atau marketer yang butuh second opinion sebelum eksekusi.",
    problems: [
      "Bingung pilih channel yang efektif",
      "Budget terbatas tapi target besar",
      "Tidak punya template tracking",
    ],
    priceList: [
      {
        name: "Strategy Call",
        price: "Rp750 ribu / sesi",
        description: "60 menit konsultasi via Zoom + rangkuman action item.",
        features: [
          "Audit singkat channel utama",
          "Prioritas channel & timeline",
          "Template dashboard sederhana",
          "Follow-up via chat 7 hari",
        ],
      },
      {
        name: "Mini Sprint",
        price: "Rp2,1 juta / 2 minggu",
        description: "Pendampingan intensif untuk satu tujuan spesifik.",
        features: [
          "2 sesi call (kickoff + review)",
          "Dokumen strategi & KPI",
          "Checklist implementasi",
          "Feedback konten/ads sebelum live",
        ],
        highlight: true,
      },
      {
        name: "Fractional Mentor",
        price: "Mulai Rp4 juta / bulan",
        description: "Pendampingan bulanan untuk tim internal.",
        features: [
          "Weekly sync call",
          "Review eksekusi harian",
          "Sparring ide kampanye",
          "Prioritization board",
        ],
      },
    ],
    benefits: [
      "Sparring partner yang objektif",
      "Framework eksekusi yang praktis",
      "Template siap pakai untuk tracking",
      "Fleksibel menyesuaikan jadwalmu",
    ],
    process: [
      {
        title: "Pre-call brief",
        description: "Kamu kirim latar belakang singkat untuk kami pelajari.",
      },
      {
        title: "Sesi konsultasi",
        description: "Diskusi interaktif + live note untuk jaga fokus.",
      },
      {
        title: "Action plan",
        description: "Dokumen prioritas dan template untuk mulai eksekusi.",
      },
      {
        title: "Follow-up",
        description: "Cek progres dan jawab pertanyaan lanjutan.",
      },
    ],
  },
  {
    slug: "kol-specialist",
    title: "KOL Specialist",
    summary:
      "Kolaborasi dengan influencer yang pas supaya awareness dan kepercayaan pelanggan naik.",
    intro:
      "Mulai dari shortlist influencer, negosiasi, hingga laporan performa kampanye.",
    bestFor: "Brand yang ingin boost awareness dengan influencer relevan.",
    problems: [
      "Sulit memilih KOL yang audiensnya cocok",
      "Proses negosiasi memakan waktu",
      "Tidak ada template report kolaborasi",
    ],
    priceList: [
      {
        name: "Starter Outreach",
        price: "Mulai Rp3 juta / kampanye",
        description: "Cocok untuk trial kolaborasi dengan nano & micro KOL.",
        features: [
          "Shortlist 10-15 KOL",
          "Script outreach & negosiasi",
          "Template brief & kontrak",
          "Ringkasan performa",
        ],
      },
      {
        name: "Momentum",
        price: "Mulai Rp6,5 juta / kampanye",
        description: "Full service untuk 5-8 KOL sekaligus.",
        features: [
          "Creative concept & CTA",
          "Koordinasi produksi konten",
          "Monitoring unggahan",
          "Insight deck + rekomendasi",
        ],
        highlight: true,
      },
      {
        name: "Ambassador Program",
        price: "Retainer bulanan",
        description: "Bangun komunitas KOL yang aktif promosi tiap bulan.",
        features: [
          "Seleksi & onboarding talent",
          "Playbook konten bulanan",
          "Incentive management",
          "Evaluation dashboard",
        ],
      },
    ],
    benefits: [
      "Seleksi KOL berdasar data audience",
      "Brief jelas sehingga konten on-brand",
      "Proses koordinasi transparan",
      "Report yang mudah dipresentasikan",
    ],
    process: [
      {
        title: "Brand immersion",
        description: "Pahami positioning dan objektif kampanye.",
      },
      {
        title: "Shortlist & outreach",
        description: "Cari talent yang tepat lalu koordinasi timeline.",
      },
      {
        title: "Execution",
        description: "Konten direview dan dipublikasikan sesuai jadwal.",
      },
      {
        title: "Measurement",
        description: "Rekap insight dan rekomendasi next move.",
      },
    ],
  },
];
