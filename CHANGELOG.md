# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2024-12-16

### Added
- Netlify Functions integration for serverless backend
- AI-powered financial insights using Groq API
- Consistent response formatting with Indonesian currency and percentage

### Changed
- Migrated from Express.js server to Netlify Functions
- Updated build configuration for Netlify deployment
- Simplified project structure for better maintainability

### Fixed
- CORS issues with API requests
- Response format handling in client
- Build and deployment configuration
- Dependencies installation in Netlify

## [0.2.3] - 2024-12-16

### Changed
- Enhanced mobile navigation UI with modern card-based design
- Improved navbar button alignment and interactions
- Optimized mobile menu layout and spacing
- Updated navigation items with better visual hierarchy

### Added
- New mobile navigation cards with icons
- Enhanced active state indicators
- Improved hover and tap animations
- Better visual feedback for mobile interactions

### Fixed
- Mobile menu button alignment and sizing
- Navigation item spacing in mobile view
- Menu transition smoothness
- Active state visibility on mobile

## [0.2.2] - 2024-12-16

### Changed
- Enhanced dark mode with proper color system and CSS variables
- Improved mobile responsiveness across all components
- Added beautiful background patterns and gradients
- Enhanced Navbar with smooth animations and better mobile menu
- Added page transition animations
- Improved overall UI consistency in both light and dark modes

## [0.2.1] - 2024-12-18

### Changed
- Enhanced AI insights formatting and response handling
- Improved text readability in the Dashboard UI
- Updated system message format for better AI analysis
- Fixed section parsing in financial insights
- Optimized error handling in API responses

## [0.2.1] - 2024-12-16

### Changed
- Replaced @headlessui with Aceternity UI components for dark mode toggle
- Enhanced dark mode styling with Aceternity UI patterns
- Improved background with dot pattern and gradient
- Added 3D card effect to settings page
- Updated theme toggle with animated sun/moon icons

## [0.2.0] - 2024-12-17

### Changed
- Enhanced glassmorphic UI design with improved transparency and depth effects
- Redesigned background with ethereal gradient orbs and animations
- Updated chart styles with softer colors and improved tooltips
- Refined typography using Inter font family consistently
- Improved card layouts with better spacing and animations
- Added floating orb animations for dynamic elements
- Optimized responsive design for better mobile experience

### Added
- New line chart with area fills for financial data visualization
- Custom glassmorphic tooltips for charts
- Smooth transitions with custom cubic-bezier curves
- Staggered animations for visual hierarchy

### Removed
- Removed pie and bar charts in favor of more focused line charts
- Eliminated redundant statistics cards for cleaner layout

### Added
- Dark mode support with system preference detection
- Theme toggle in Settings page
- Theme persistence using localStorage
- Added @headlessui/react for toggle switch component

## [0.1.1] - 2024-12-16

### Fixed
- Fixed layout issues in Dashboard to properly fit the screen
- Improved chart sizing and responsiveness
- Optimized spacing and padding throughout the UI
- Fixed overflow issues in the main container

### Changed
- Reduced font sizes for better space efficiency
- Optimized chart legend positioning and sizing
- Updated container structure for better height management
- Simplified global styles in index.css

### Technical
- Removed conflicting styles from index.css
- Improved overflow handling at root level
- Added proper height inheritance
- Optimized chart configurations for better display

## [0.1.0] - 2024-12-15

### Added
- Initial release of Cuan Check
- Dashboard with financial summary cards
- Pie chart for expense distribution
- Bar chart for monthly trends
- Highlights section with key metrics
- Responsive navigation with mobile support
- Dark mode support
- Modern UI components with Aceternity UI
- Tailwind CSS styling
- Chart.js integration
- Framer Motion animations

## [1.2.0] - 2024-12-16

### Added
- Fitur berbagi analisis keuangan:
  - Tombol salin untuk menyalin seluruh analisis ke clipboard
  - Integrasi berbagi ke WhatsApp
  - Integrasi berbagi ke Telegram
  - Notifikasi sukses saat menyalin
  - Format teks yang rapi untuk dibagikan

### Changed
- Peningkatan UI pada bagian analisis:
  - Warna teks yang lebih kontras
  - Latar belakang semi-transparan
  - Tata letak yang lebih rapi
- Migrasi dari OpenAI ke Groq untuk analisis AI
- Peningkatan format output analisis

### Fixed
- Perbaikan masalah kontras warna teks
- Perbaikan tampilan pada layar kecil
- Perbaikan format teks saat dibagikan

## [1.1.0] - 2024-12-15

### Added
- Fitur analisis keuangan AI:
  - Integrasi dengan Groq API
  - Analisis komprehensif keuangan personal
  - Rekomendasi yang dipersonalisasi
  - Tampilan hasil analisis yang terstruktur

### Changed
- Peningkatan UI/UX secara keseluruhan
- Optimasi performa aplikasi

### Fixed
- Perbaikan bug pada kalkulasi keuangan
- Perbaikan masalah responsivitas

## [1.0.0] - 2024-12-14

### Added
- Fitur dasar kalkulator keuangan
- Dashboard utama dengan visualisasi data
- Manajemen pengeluaran bulanan
- Sistem target tabungan
- Kalkulasi pensiun

### Initial Release
- Aplikasi kalkulator keuangan personal
- UI dengan desain glassmorphic
- Sistem manajemen pengeluaran
- Visualisasi data keuangan
