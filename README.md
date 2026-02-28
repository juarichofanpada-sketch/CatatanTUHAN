# ✝ Catatan Tuhan v2.0 — By Juaricho

Aplikasi berbagi catatan & link Google Drive berbasis iman Kristen.

---

## PENTING — Struktur Folder di GitHub

```
catatan-tuhan/
├── public/
│   ├── index.html    <- Frontend (HTML + CSS)
│   └── app.js        <- Logika JavaScript
├── server.js         <- Backend Node.js + Express
├── db.json           <- Database default
├── package.json      <- Dependencies
├── render.yaml       <- Konfigurasi Render
└── README.md
```

> index.html dan app.js HARUS ada di dalam folder public/

---

## Deploy ke Render.com

### 1. Struktur folder di GitHub harus seperti di atas
Buat folder "public" di repo, lalu pindahkan index.html dan app.js ke dalamnya.

### 2. Buat Web Service
1. render.com -> New+ -> Web Service
2. Connect repo GitHub
3. Isi:
   - Environment: Node
   - Build Command: npm install
   - Start Command: node server.js
4. Create Web Service

### 3. Tambah Environment Variable
Di tab Environment tambahkan:
  RENDER = true
  NODE_ENV = production

### 4. Test
Buka: https://nama-app.onrender.com/health
Harus muncul: {"ok":true,"status":"running",...}

---

## Catatan: Data di Free Tier

Render Free Tier = data hilang saat server restart.
Ini normal. Untuk data permanen perlu upgrade atau pakai database eksternal.

---

## Akun Default

Admin (3 sandi): 1223334444 | Juaricho12345678 | Andre123#

User: Juaricho/jua2024, Maria/maria123, Samuel/sam2024, Ruth/ruth2024

---
By Juaricho - Didukung Claude
