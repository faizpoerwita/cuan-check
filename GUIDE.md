# Cuan Check - Aplikasi Manajemen Keuangan

## Deskripsi
Cuan Check adalah aplikasi web SaaS untuk manajemen keuangan personal yang memudahkan pengguna melacak pemasukan dan pengeluaran mereka.

## Antarmuka Pengguna
Aplikasi menggunakan Bahasa Indonesia secara menyeluruh dengan komponen UI modern dari Aceternity UI.

### Tema dan Styling
- Menggunakan Aceternity UI untuk komponen modern dan animasi
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
- Navigasi responsif dengan menu mobile modern:
  - Kartu navigasi dengan ikon dan teks
  - Indikator aktif dengan gradien dan bayangan
  - Animasi halus untuk hover dan tap
  - Tombol menu yang selaras dengan desain
  - Transisi mulus untuk membuka/tutup menu
- Loading state dan skeleton untuk pengalaman yang mulus
- Toast notifications untuk feedback sistem

### Responsivitas
- Layout fluid yang beradaptasi di semua ukuran layar
- Breakpoint utama: mobile (< 640px), tablet (< 1024px), desktop (≥ 1024px)
- Font size yang responsif menggunakan clamp()
- Spacing yang konsisten menggunakan rem unit
- Grid dan flexbox untuk layout yang fleksibel

### Aksesibilitas
- Kontras warna yang memenuhi standar WCAG
- Markup semantik untuk screen reader
- Focus state yang jelas untuk navigasi keyboard
- Aria labels untuk elemen interaktif
- Pesan error yang deskriptif

## Fitur Utama

### 1. Dashboard Utama
**Tujuan**: Memberikan gambaran umum status keuangan.

**Konten**:
- Ringkasan Keuangan:
  - Total pemasukan
  - Total pengeluaran
  - Saldo bersih (pemasukan - pengeluaran)
- Grafik Visual:
  - Diagram Lingkaran: Proporsi pengeluaran per kategori
  - Diagram Batang: Tren bulanan pemasukan dan pengeluaran
- Sorotan:
  - Kategori pengeluaran terbesar
  - Persentase pengeluaran dibanding pemasukan

### 2. Halaman Transaksi
**Tujuan**: Menampilkan dan mengelola transaksi keuangan secara detail.

**Konten**:
- Tabel Transaksi:
  - Kolom: Tanggal, Kategori, Deskripsi, Jumlah
  - Aksi: Edit dan Hapus
- Pencarian dan Filter:
  - Filter berdasarkan tanggal, kategori, atau jenis
  - Pengurutan data

### 3. Tambah Transaksi Baru
**Tujuan**: Input manual data pemasukan atau pengeluaran.

**Form**:
- Tanggal (dengan date picker modern)
- Kategori (dropdown dengan animasi)
- Deskripsi (opsional)
- Jumlah (dengan format Rupiah otomatis)
- Tombol Simpan dengan efek hover

### 4. Halaman Statistik
**Tujuan**: Analisis keuangan detail.

**Konten**:
- Statistik Bulanan
- Statistik Tahunan
- Wawasan Keuangan

### 5. Ekspor Data
**Tujuan**: Menyimpan atau berbagi data keuangan.

**Opsi**:
- Format: Excel/CSV
- Pilihan data

### 6. Pengaturan Pengguna
**Tujuan**: Kustomisasi pengalaman pengguna.

**Konten**:
- Manajemen Kategori
- Pengaturan Bahasa
- Pengaturan Akun

### 7. Fitur Analisis Keuangan AI

### Mendapatkan Analisis
1. Klik tombol "Analisis Keuangan" untuk mendapatkan analisis berdasarkan data keuangan Anda
2. Tunggu beberapa saat hingga analisis selesai dihasilkan
3. Analisis akan mencakup:
   - Kesehatan keuangan secara umum
   - Pola pengeluaran
   - Rekomendasi penghematan
   - Strategi mencapai target
   - Tips tambahan

### Berbagi Analisis
1. **Salin Analisis**
   - Klik tombol "Salin Analisis" untuk menyalin seluruh teks analisis ke clipboard
   - Akan muncul notifikasi "Tersalin!" jika berhasil
   - Teks yang disalin bisa langsung di-paste ke aplikasi lain

2. **Berbagi ke Media Sosial**
   - Klik ikon WhatsApp untuk membagikan ke WhatsApp
   - Klik ikon Telegram untuk membagikan ke Telegram
   - Konten yang dibagikan akan mencakup:
     - Judul "Analisis Keuangan dari Cuan Check"
     - Hasil analisis lengkap
     - Link ke aplikasi

3. **Format Teks**
   - Teks analisis akan diformat dengan rapi
   - Menggunakan poin-poin dan penomoran yang jelas
   - Mudah dibaca di berbagai platform

## Layout Guidelines

### Root Layout
- Use `h-full` and `overflow-hidden` at root level (html, body, #root)
- Main container should use `flex flex-col` for proper height distribution
- Content area should have `overflow-auto` for scrolling when needed

### Dashboard Layout
- Use fixed heights for chart sections to prevent layout shifts
- Keep padding and margins minimal (p-3, gap-3)
- Use smaller font sizes for better space efficiency
- Optimize chart legends and labels for compact display

### Responsive Design
- Mobile-first approach with progressive enhancement
- Use grid system with proper breakpoints (sm, lg)
- Adjust font sizes and spacing based on screen size
- Charts should maintain aspect ratio while fitting available space

### Best Practices
- Always use flex-1 with min-h-0 for flexible height containers
- Maintain consistent spacing throughout the application
- Use relative units where possible
- Consider content overflow in all components

## Design Guidelines for Cuan Check

### Color Palette

#### Primary Colors
- Background: `rgb(240, 245, 255)` - Light blue base
- Card Background: `rgba(255, 255, 255, 0.8)` with backdrop-filter blur
- Primary Blue: `rgb(64, 123, 255)` - Active states & CTAs
- Text Primary: `rgb(23, 23, 23)`
- Text Secondary: `rgb(107, 114, 128)`

#### Accent Colors
- Success: `rgb(34, 197, 94)` - Positive trends
- Danger: `rgb(239, 68, 68)` - Negative trends
- Warning: `rgb(234, 179, 8)` - Warning states

### Typography

#### Font Hierarchy
- Headings: Inter, 24px/1.5, font-weight: 600
- Subheadings: Inter, 18px/1.5, font-weight: 500
- Body: Inter, 14px/1.5, font-weight: 400
- Small Text: Inter, 12px/1.5, font-weight: 400

### Components

#### Cards
- Background: `rgba(255, 255, 255, 0.8)`
- Backdrop Filter: `blur(12px)`
- Border: `1px solid rgba(255, 255, 255, 0.5)`
- Border Radius: `16px`
- Box Shadow: `0 4px 24px rgba(0, 0, 0, 0.03)`

#### Buttons
- Border Radius: `12px`
- Padding: `8px 16px`
- Height: `40px`
- Transition: `all 0.2s ease-in-out`

#### Charts
- Use soft, pastel colors
- Apply subtle gradients
- Include hover states
- Maintain consistent spacing

### Layout

#### Spacing
- Base Unit: `4px`
- Card Padding: `24px`
- Grid Gap: `24px`
- Section Margin: `32px`

#### Grid System
- Use CSS Grid for layout
- Responsive breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Effects

#### Glassmorphism
- Background: `rgba(255, 255, 255, 0.8)`
- Backdrop Filter: `blur(12px)`
- Border: `1px solid rgba(255, 255, 255, 0.5)`

#### Animations
- Use `framer-motion` for transitions
- Keep animations subtle and smooth
- Duration: 0.2s - 0.4s
- Easing: ease-in-out

### Best Practices

1. Maintain consistent spacing
2. Use glassmorphism effects judiciously
3. Keep animations subtle
4. Ensure high contrast for text
5. Make interactive elements obvious
6. Use shadows to create depth
7. Apply consistent border radius

## Teknologi

### Frontend
- React.js dengan Vite
- Aceternity UI untuk komponen modern
- Tailwind CSS untuk styling
- Framer Motion untuk animasi
- Chart.js untuk visualisasi data
- React Router untuk navigasi
- Axios untuk HTTP requests

### Backend
- Node.js dengan Express.js
- MongoDB untuk database

### Deployment
- Frontend: Netlify
- Database: MongoDB Atlas

## Struktur Proyek

```
cuan-check/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Komponen UI yang dapat digunakan kembali
│   │   ├── pages/     # Halaman utama aplikasi
│   │   ├── utils/     # Fungsi utilitas
│   │   └── styles/    # Style dan tema
│   ├── public/        # File statis
│   └── dist/          # Build produksi
├── GUIDE.md           # Dokumentasi fitur aplikasi
└── README.md          # Dokumentasi setup
```

## Terjemahan UI

### Navigasi
- Dashboard = Dashboard
- Transactions = Transaksi
- Statistics = Statistik
- Settings = Pengaturan

### Tombol dan Aksi
- Add = Tambah
- Edit = Ubah
- Delete = Hapus
- Save = Simpan
- Cancel = Batal
- Export = Ekspor
- Import = Impor

### Label Form
- Date = Tanggal
- Category = Kategori
- Description = Deskripsi
- Amount = Jumlah
- Type = Jenis
- Income = Pemasukan
- Expense = Pengeluaran

### Pesan
- Success = Berhasil
- Error = Gagal
- Loading = Memuat
- No Data = Data Kosong
- Confirm Delete = Konfirmasi Hapus

## Stack Teknologi

### Backend
- Node.js dengan Express.js
- MongoDB

### Frontend
- React.js
- Tailwind CSS

### Visualisasi
- Chart.js

### Deployment
- Platform: Vercel/AWS
- Database: MongoDB Atlas

## Struktur Database

### Collection: transactions
- _id
- date
- category
- description
- amount
- type

### Collection: categories
- _id
- name
- type

### Collection: users
- _id
- username
- email
- preferences

## Alur Pengguna
1. Login (Opsional)
2. Dashboard
3. Halaman Transaksi
4. Tambah Transaksi
5. Statistik
6. Ekspor Data
7. Pengaturan
