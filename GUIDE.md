# Cuan Check - Aplikasi Manajemen Keuangan

## Deskripsi
Cuan Check adalah aplikasi web SaaS untuk manajemen keuangan personal yang memudahkan pengguna melacak pemasukan dan pengeluaran mereka.

## Teknologi

### Frontend
- React dengan Vite
- Tailwind CSS untuk styling
- React Router untuk navigasi
- Chart.js untuk visualisasi data

### Backend
- Netlify Functions untuk serverless backend
- Groq API untuk analisis keuangan AI
- Node-fetch untuk HTTP requests

## Konfigurasi

### Environment Variables
1. Frontend (`.env.production`):
```env
VITE_API_URL=https://api.groq.com/openai/v1/chat/completions
VITE_SERVER_URL=/.netlify/functions
VITE_API_KEY=your-groq-api-key
```

2. Netlify Functions:
```env
GROQ_API_KEY=your-groq-api-key
```

### Netlify Configuration
File `netlify.toml`:
```toml
[build]
  command = "cd client && npm install && npm run build"
  publish = "client/dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
  included_files = ["package.json"]

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Antarmuka Pengguna
Aplikasi menggunakan Bahasa Indonesia secara menyeluruh

### Tema dan Styling
- Desain minimalis dengan warna-warna lembut dan netral
- Latar belakang menggunakan gradien halus dan efek glassmorphic
- Kartu dan komponen menggunakan efek bayangan halus
- Warna utama: biru navy (#1E3A8A) untuk elemen interaktif
- Warna aksen: biru muda (#E5F3FF) untuk highlight dan indikator
- Mode terang menggunakan latar putih dengan transparansi tinggi
- Transisi halus antar halaman dan komponen

### Komponen UI
- Kartu dengan efek hover 3D yang halus
- Tombol dengan animasi hover dan klik
- Input field dengan validasi dan feedback visual
- Navigasi responsif dengan menu mobile modern
- Loading state dan skeleton untuk pengalaman yang mulus
- Toast notifications untuk feedback sistem

### Responsivitas
- Layout fluid yang beradaptasi di semua ukuran layar
- Breakpoint utama: mobile (< 640px), tablet (< 1024px), desktop (≥ 1024px)
- Font size yang responsif menggunakan clamp()
- Spacing yang konsisten menggunakan rem unit
- Grid dan flexbox untuk layout yang fleksibel

## Fitur Utama

### 1. Dashboard Utama
- Ringkasan keuangan (pemasukan, pengeluaran, saldo)
- Grafik visual (diagram lingkaran dan batang)
- Sorotan kategori pengeluaran

### 2. Analisis AI
- Analisis mendalam pola keuangan
- Rekomendasi optimasi keuangan
- Proyeksi pertumbuhan keuangan
- Format respons yang konsisten dengan:
  - Pembersihan kode dan markup
  - Format mata uang Indonesia
  - Format persentase
  - Timestamp dan branding

### 3. Manajemen Transaksi
- Input transaksi dengan validasi
- Kategorisasi otomatis
- Riwayat transaksi
- Filter dan pencarian

### 4. Ekspor Data
- Format Excel/CSV
- Pilihan data untuk ekspor

## Development Guide

### Setup Lokal
1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Setup environment variables
4. Run development server:
   ```bash
   npm run dev
   ```

### Local Development

### Prerequisites
1. Node.js and npm installed
2. Netlify CLI installed globally (`npm install -g netlify-cli`)
3. Environment variables set up (see Environment Variables section)

### Running the Development Server
You can start the development server in two ways:

1. Using the batch file:
   - Simply double-click `start-dev.bat` in the project root
   - This will start both the Vite dev server and Netlify Functions

2. Manually:
   ```bash
   netlify dev
   ```

The app will be available at http://localhost:8888

### Environment Variables for Local Development
Create a `.env` file in the project root with these variables:
```
GROQ_API_KEY=your_groq_api_key_here
```

### Deployment
1. Push ke GitHub
2. Netlify akan otomatis mendeploy perubahan
3. Pastikan environment variables sudah dikonfigurasi di Netlify

### Best Practices
- Gunakan TypeScript untuk type safety
- Ikuti konvensi penamaan yang konsisten
- Dokumentasikan perubahan di CHANGELOG.md
- Test fitur sebelum deploy
- Gunakan error handling yang proper
- Validasi input user
- Maintain kode yang bersih dan terorganisir
