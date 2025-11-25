# Quick Deployment Guide - Netlify

## ✅ Status: Ready to Deploy!

Website sudah berhasil dimigrasi ke Netlify adapter. Semua fitur tetap berfungsi.

---

## 🚀 Deploy Sekarang (Pilih Salah Satu)

### Option 1: Via Git (Paling Mudah)

```bash
# 1. Commit changes
git add .
git commit -m "Migrate to Netlify"
git push

# 2. Connect di Netlify Dashboard
# - Login ke netlify.com
# - "Add new site" → "Import existing project"
# - Pilih repository
# - Deploy!
```

### Option 2: Netlify CLI

```bash
# 1. Install CLI (sekali saja)
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod
```

### Option 3: Drag & Drop

```bash
# 1. Build
npm run build

# 2. Drag folder "dist/" ke netlify.com/drop
```

---

## 📋 Yang Berubah

| Item | Sebelumnya | Sekarang |
|------|------------|----------|
| Adapter | Node.js | Netlify |
| Hosting | Butuh VPS | Serverless |
| Deploy | Manual | Auto (git push) |
| Admin Panel | ✅ Server | ✅ Functions |
| API Endpoints | ✅ Server | ✅ Functions |

---

## ⚠️ Penting

- **File Upload**: Max 10MB per request (Netlify limit)
- **Environment Variables**: Set di Netlify Dashboard jika ada
- **Build Minutes**: 300 menit/bulan (free tier)

---

## 🔍 Test Setelah Deploy

- [ ] Homepage (`/`)
- [ ] Blog posts
- [ ] Admin panel (`/admin`)
- [ ] Upload image
- [ ] Create/edit article

---

Untuk detail lengkap, lihat [walkthrough.md](file:///home/muji/.gemini/antigravity/brain/ddd222f4-001f-407e-be49-5d51c7d91f7a/walkthrough.md)
