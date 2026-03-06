project/
├─ .env
├─ .eslintrc.json
├─ .gitignore
├─ .next/
│  ├─ app-build-manifest.json
│  ├─ build-manifest.json
│  ├─ fallback-build-manifest.json
│  ├─ package.json
│  ├─ react-loadable-manifest.json
│  ├─ trace
│  ├─ cache/
│  │  └─ webpack/
│  │     ├─ client-development/
│  │     ├─ client-development-fallback/
│  │     └─ server-development/
│  ├─ server/
│  │  ├─ _error.js
│  │  ├─ app/
│  │  │  ├─ app-paths-manifest.json
│  │  │  └─ page.js
│  │  ├─ pages/
│  │  │  ├─ _app.js
│  │  │  ├─ _document.js
│  │  │  └─ _error.js
│  │  ├─ pages-manifest.json
│  │  ├─ middleware-build-manifest.js
│  │  ├─ middleware-manifest.json
│  │  ├─ middleware-react-loadable-manifest.js
│  │  ├─ next-font-manifest.js
│  │  ├─ next-font-manifest.json
│  │  ├─ server-reference-manifest.js
│  │  ├─ server-reference-manifest.json
│  │  ├─ vendor-chunks/
│  │  │  ├─ @swc.js
│  │  │  ├─ lucide-react.js
│  │  │  └─ next.js
│  │  └─ webpack-runtime.js
│  ├─ static/
│  │  ├─ chunks/
│  │  │  ├─ fallback/
│  │  │  └─ polyfills.js
│  │  └─ development/
│  │     ├─ _buildManifest.js
│  │     └─ _ssgManifest.js
│  └─ types/
│     ├─ app/
│     │  ├─ layout.ts
│     │  └─ page.ts
│     └─ package.json
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ mapa/
│  │  ├─ MapaClient.tsx
│  │  ├─ page.tsx
│  │  └─ [id]/
│  │     └─ page.tsx
│  └─ sobre/
│     └─ page.tsx
├─ components/
│  └─ ui/
│     ├─ accordion.tsx
│     ├─ alert-dialog.tsx
│     ├─ alert.tsx
│     ├─ aspect-ratio.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ carousel.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ collapsible.tsx
│     ├─ command.tsx
│     ├─ context-menu.tsx
│     ├─ dialog.tsx
│     ├─ drawer.tsx
│     ├─ dropdown-menu.tsx
│     ├─ form.tsx
│     ├─ hover-card.tsx
│     ├─ input-otp.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ menubar.tsx
│     ├─ navigation-menu.tsx
│     ├─ pagination.tsx
│     ├─ popover.tsx
│     ├─ progress.tsx
│     ├─ radio-group.tsx
│     ├─ resizable.tsx
│     ├─ scroll-area.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ skeleton.tsx
│     ├─ slider.tsx
│     ├─ sonner.tsx
│     ├─ switch.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ textarea.tsx
│     ├─ toast.tsx
│     ├─ toaster.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     ├─ tooltip.tsx
│     └─ utils.tsx
├─ hooks/
│  └─ use-toast.ts
├─ lib/
│  └─ utils.ts
├─ public/
│  └─ marker.svg
│  └─ sw.js
│  └─ manifest.webmanifest
│  └─ dados-complementares.json
│  └─ exploracao.mp4
├─ src/
│  ├─ components/
│  │  ├─ Filters.tsx
│  │  ├─ Footer.tsx
│  │  ├─ Header.tsx
│  │  ├─ MapView.tsx
│  │  ├─ MapPointModal.tsx
│  │  ├─ MapSection.tsx
│  │  ├─ MobileSheet.tsx
│  │  ├─ PointPanel.tsx
│  │  └─ PointsList.tsx
│  ├─ config/
│  │  └─ appConfig.ts
│  ├─ services/
│  │  └─ loadPointsFromCsv.ts
│  │  └─ loadPointsFromIphan.ts
│  │  └─ loadComplementaryData.ts
│  └─ types/
│     └─ Point.ts
├─ components.json
├─ netlify.toml
├─ next-env.d.ts
├─ next.config.js
├─ package.json
├─ package-lock.json
├─ postcss.config.js
├─ tailwind.config.ts
└─ tsconfig.json
