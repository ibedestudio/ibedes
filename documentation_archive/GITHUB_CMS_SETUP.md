# Setup GitHub CMS di Netlify

## ✅ Yang Sudah Dilakukan

1. ✅ Install `@octokit/rest` package
2. ✅ Buat `src/lib/github-cms.ts` utility
3. ✅ Update `/api/admin/save` untuk pakai GitHub API
4. ✅ Update `/api/admin/delete` untuk pakai GitHub API
5. ✅ Set environment variables di local (`.env`)
6. ✅ Build berhasil

---

## 🔧 Setup di Netlify (WAJIB!)

### Langkah 1: Set Environment Variables

1. **Login ke Netlify**: https://app.netlify.com
2. **Pilih site** "ibedes" 
3. **Go to**: Site settings → Environment variables
4. **Add variables** berikut:

```
GITHUB_TOKEN = ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER = ibedestudio
GITHUB_REPO = ibedes
GITHUB_BRANCH = main
```

**⚠️ IMPORTANT**: Gunakan GitHub token yang sudah Anda buat sebelumnya!

**Cara add**:
- Click "Add a variable"
- Key: `GITHUB_TOKEN`
- Value: (paste token Anda)
- Scope: "All scopes" atau "Production"
- Click "Create variable"
- Ulangi untuk `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`


### Langkah 2: Trigger Redeploy

Setelah set environment variables:

1. **Go to**: Deploys tab
2. **Click**: "Trigger deploy" → "Deploy site"
3. **Wait**: ~2-3 menit untuk build selesai

---

## 🚀 Deploy Sekarang

```bash
git add .
git commit -m "Implement GitHub CMS for admin panel"
git push
```

Netlify akan auto-deploy. Setelah deploy selesai dan environment variables sudah di-set, admin panel akan berfungsi di production!

---

## 📝 Cara Kerja

### Sebelumnya (❌ Error di Production):
```
Admin Panel → Write to filesystem → ❌ ENOENT (read-only)
```

### Sekarang (✅ Works):
```
Admin Panel → GitHub API → Commit to repo → Netlify auto-deploy
```

### Flow:
1. User save article di admin panel
2. API call ke GitHub untuk commit changes
3. GitHub repository updated
4. Netlify detect changes → auto-deploy
5. Website updated dalam ~2 menit

---

## ✅ Testing Checklist

Setelah deploy:

1. [ ] Buka `https://ibedes.xyz/admin`
2. [ ] Edit article
3. [ ] Click "Save"
4. [ ] Cek response: "File saved successfully. Netlify will auto-deploy in ~2 minutes."
5. [ ] Wait 2 menit
6. [ ] Refresh article page → changes should be live
7. [ ] Check GitHub repo → should see new commit

---

## 🔒 Security Notes

- ✅ GitHub token di `.env` (gitignored)
- ✅ Token di Netlify environment variables (encrypted)
- ✅ Filename validation untuk prevent path traversal
- ⚠️ **JANGAN** commit `.env` ke Git!

---

## 🐛 Troubleshooting

### Error: "GITHUB_TOKEN environment variable is required"
→ Environment variables belum di-set di Netlify. Ikuti Langkah 1 di atas.

### Error: "Bad credentials"
→ GitHub token salah atau expired. Generate token baru.

### Changes tidak muncul setelah save
→ Wait 2-3 menit untuk Netlify deploy. Check Netlify deploy logs.

### Commit muncul di GitHub tapi Netlify tidak deploy
→ Check Netlify build hooks. Pastikan GitHub integration aktif.
