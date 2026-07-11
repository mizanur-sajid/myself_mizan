<div align="center">

# Mizanur Rahman — Portfolio

**A full-stack personal portfolio and content management system built with Next.js and PHP.**

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](#backend--deployment)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](#backend--deployment)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

*A statically exported Next.js SPA paired with a PHP/MySQL REST API — showcasing skills, publications, certifications, and projects, backed by a secure, full-featured admin dashboard.*

</div>

---

## 📌 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [💻 Getting Started](#-getting-started)
- [🔐 Admin Panel](#-admin-panel)
- [🚀 Deployment](#-deployment)
- [🎨 Design System](#-design-system)
- [📄 License](#-license)

---

## ✨ Overview

This is not a traditional static portfolio. The frontend is a statically exported **Next.js 16 SPA** that fetches all of its content — skills, publications, certifications, projects, and social links — from a **PHP/MySQL REST API** at runtime. An integrated admin dashboard allows full CRUD management of every section, file uploads, avatar cropping, and visitor analytics.

The public-facing site is a single-page application with six core sections:

1. **Hero** — Branding, animated availability badge, profile photo with a rotating gradient ring, resume viewer, and hero stats.
2. **Technical Skills** — Categorized skill grid (Technical + Additional) with auto-mapped SVG icons.
3. **Publications** — Academic research cards with abstracts, research highlights, tech stack pills, and document links.
4. **Certifications** — Verified credentials with skill chips, issue dates, and credential download links.
5. **Projects** — Featured and standard project cards with thumbnails, feature lists, stats, and external links.
6. **Contact** — Rich text form submission powered by a PHP backend with topic chips and real-time validation.

---

## 🚀 Key Features

### 🌟 Public Site

- **Glassmorphism UI** — frosted glass panels with `backdrop-filter: blur()`, layered radial background glows, and gradient ring accents.
- **Dark & Light Theme** — full CSS variable system toggled via `[data-theme='dark']`, with distinct palettes for each mode.
- **Warm Editorial (Light)** — parchment/cream base (`#F5F0EB`) with rich violet, amber gold, and rose accents.
- **Obsidian Aurora (Dark)** — deep obsidian base (`#0E0C15`) with electric violet, aurora emerald-teal, and vibrant rose accents.
- **Fluid Typography** — `clamp()` sizing scaling seamlessly from 360px to 4K.
- **Framer Motion** — scroll-triggered animations, staggered card reveals, and hover micro-interactions.
- Animated gradient mesh background with a slow-drifting radial glow composition.
- Sticky navigation bar with smooth anchor scrolling and a mobile hamburger menu.
- Theme-aware hero title — name styling adapts between light and dark modes.
- Floating social sidebar with links fetched live from the API.
- Smooth scroll via **Lenis** for native-feeling inertia scrolling.
- PDF viewer modal via **pdf.js** for in-browser résumé preview.

### 📱 Mobile Responsiveness

- Dedicated breakpoints: 360px, 480px, 640px, 768px, 834px, 1024px, and 1440px+.
- Mobile hamburger nav with theme-aware opaque backdrop.
- Responsive contact form with centered icons inside inputs.
- Responsive hero layout with `wrap-reverse` stacking and fluid profile image sizing.

### 🔐 Admin Panel (`/secure-panel`)

- Session-based authentication with **CSRF token protection** via `jose`.
- Command Center dashboard with traffic overview, portfolio summary, and content counts.
- **Recharts** analytics charts and live activity feed.
- Full **CRUD management** for Skills, Publications, Certifications, Projects, and Social Links.
- Rich text editor (**react-quill-new**) and image upload with crop modal (**react-easy-crop**).
- Collapsible sidebar navigation with a real-time clock.
- `AuthGuard` component wrapping all protected routes.

---

## 🛠️ Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router, `output: 'export'`) |
| Library | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Vanilla CSS (custom properties, glassmorphism, fluid clamp) |
| Animations | Framer Motion 12 |
| Smooth Scroll | Lenis 1.3 |
| Icons | Lucide React 1.21 |
| Charts | Recharts 3 |
| Rich Text | react-quill-new 3 |
| Image Crop | react-easy-crop 6 |
| PDF Viewer | pdfjs-dist 6 |
| Auth Tokens | jose 6 |
| HTML Sanitize | DOMPurify 3 |

### Backend & Deployment

| Category | Technology |
|---|---|
| API | PHP (REST endpoints, PDO) |
| Database | MySQL |
| FTP Deploy | basic-ftp 6 |
| Host | InfinityFree |

---

## 📁 Project Structure

<details>
<summary>Click to expand project structure</summary>

```text
myself_mizan/
├── public/
│   ├── api/                        # PHP REST API endpoints
│   │   ├── skills.php
│   │   ├── publications.php
│   │   ├── certifications.php
│   │   ├── projects.php
│   │   ├── socials.php
│   │   ├── contact.php
│   │   ├── stats.php
│   │   ├── config.php
│   │   └── auth/                   # Login / logout / CSRF endpoints
│   ├── uploads/                    # User-uploaded media (images, documents)
│   ├── profile.png                 # Profile photo
│   └── Mizan_CV.png                # Résumé (displayed in PDF viewer)
├── scripts/
│   └── deploy.js                   # FTP deployment script (basic-ftp)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, theme provider, bg glows)
│   │   ├── globals.css             # Full design system (light/dark tokens, animations)
│   │   ├── page.tsx                # Main portfolio SPA (all public sections)
│   │   ├── page.module.css         # Scoped page-level overrides
│   │   ├── secure-login/           # Admin login page
│   │   └── secure-panel/           # Admin dashboard (per-section sub-routes)
│   │       ├── page.tsx            # Dashboard home
│   │       ├── skills/
│   │       ├── publications/
│   │       ├── certifications/
│   │       ├── projects/
│   │       ├── socials/
│   │       ├── messages/
│   │       ├── settings/
│   │       └── security/
│   ├── components/
│   │   ├── ui/                     # Public-facing components
│   │   │   ├── AvailabilityBadge.tsx
│   │   │   ├── Button.tsx / Button.module.css
│   │   │   ├── ContactForm.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── ImageCropperModal.tsx
│   │   │   ├── ImageViewerModal.tsx
│   │   │   ├── RichEditor.tsx
│   │   │   ├── SirenText.tsx
│   │   │   ├── SkillIcon.tsx
│   │   │   ├── SocialSidebar.tsx
│   │   │   └── StickyNav.tsx
│   │   ├── admin/                  # Admin-only components
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── AdminCharts.tsx
│   │   │   ├── AdminClock.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AuthGuard.tsx
│   │   └── shared/                 # Cross-cutting components
│   └── lib/
│       ├── auth.ts                 # Client-side auth utilities
│       └── sanitize.ts             # DOMPurify HTML sanitization wrapper
├── .env                            # Environment variables (API base URL, etc.)
├── next.config.ts                  # Static export + image config
├── tsconfig.json
└── eslint.config.mjs
```

</details>

---

## 💻 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn / pnpm)
- A **PHP + MySQL server** for the backend API (or use the live hosted API)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/mizanur-sajid/myself_mizan.git

# Navigate into the project
cd myself_mizan

# Install dependencies
npm install

# Start the development server
npm run dev
```

> Open [http://localhost:3000](http://localhost:3000). Ensure your local PHP server or production API URL is set correctly in `.env`.

### Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_BASE=https://your-api-domain.com/api
ENABLE_VIEW_COUNTER=false
```

### Build (Static Export)

```bash
npm run build
```

Generates a fully static export in the `out/` directory, ready for FTP deployment.

---

## 🔐 Admin Panel

The admin panel is accessible at `/secure-login`. After authenticating, you are redirected to `/secure-panel`, which offers:

| Section | Description |
|---|---|
| 📊 **Dashboard** | Real-time page views, unique visitors, and content counts |
| 🧠 **Skills** | Add, edit, reorder, and delete technical & additional skills |
| 📝 **Publications** | Manage academic research papers with rich text abstracts |
| 🏅 **Certifications** | Manage credentials with skill chips and file uploads |
| 🗂️ **Projects** | Featured/standard project cards with thumbnails and links |
| 🔗 **Socials** | Manage floating sidebar social media links |
| 📬 **Messages** | View contact form submissions |
| ⚙️ **Settings** | Configure hero text, footer, and site-wide options |
| 🔒 **Security** | Change admin password |

All admin routes are protected by `AuthGuard`, which verifies session authentication and CSRF tokens on every render.

---

## 🚀 Deployment

The project includes a streamlined one-command deployment to InfinityFree via FTP:

```bash
# 1. Build the static export
npm run build

# 2. Deploy to the server (clears old files, uploads new ones)
npm run deploy
```

The deploy script (`scripts/deploy.js`) will:
1. Connect to the InfinityFree FTP server.
2. Clear **all existing files and directories** from `/htdocs`.
3. Upload the entire `out/` directory to `/htdocs`.

> **Note:** The `_not-found` directory is automatically removed before upload as InfinityFree doesn't require it.

---

## 🎨 Design System

The entire visual identity is defined through CSS custom properties in [`globals.css`](./src/app/globals.css).

### Color Palettes

**Light Mode — Warm Editorial**

| Token | Value | Role |
|---|---|---|
| `--bg-color` | `#F5F0EB` | Warm parchment/cream base |
| `--primary-color` | `#7C3AED` | Rich violet — CTAs & highlights |
| `--accent-color` | `#F59E0B` | Warm amber gold — secondary accents |
| `--highlight-color` | `#EC4899` | Vivid rose — gradient third stop |
| `--text-primary` | `#1A1523` | Deep warm charcoal |
| `--text-secondary` | `#5C5470` | Muted warm violet-gray |

**Dark Mode — Obsidian Aurora**

| Token | Value | Role |
|---|---|---|
| `--bg-color` | `#0E0C15` | Deep obsidian black-violet base |
| `--primary-color` | `#A78BFA` | Soft electric violet — CTAs |
| `--accent-color` | `#34D399` | Aurora emerald-teal — secondary |
| `--highlight-color` | `#F472B6` | Vibrant rose — gradient third stop |
| `--text-primary` | `#F0EBF8` | Warm white with violet tint |
| `--text-secondary` | `#A89CC0` | Muted lavender |

### Other Design Tokens

- **Glass Panels:** `backdrop-filter: blur(20px)` with `--glass-bg` / `--glass-border` variables.
- **Gradients:** `--gradient-primary` flows Violet → Rose → Amber (light) / Violet → Rose → Emerald (dark).
- **Typography:** `Inter` for body, `Outfit` / `Plus Jakarta Sans` for headings, `Space Grotesk` for accent labels.
- **Animations:** Framer Motion scroll reveals, staggered lists, profile float, gradient ring rotation, and background mesh drift.

---

## 📄 License

This project is the personal portfolio of **Mizanur Rahman**. All rights reserved.

<div align="center">
  <p><em>Built with ❤️ and passion by Mizanur Rahman.</em></p>
</div>
