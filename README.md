<div align="center">
  <h1>Mizanur Rahman — Portfolio ✨</h1>
  <p>
    <strong>A full-stack personal portfolio and content management system built with Next.js and PHP.</strong>
  </p>
  
  <p>
    <a href="#tech-stack">
      <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    </a>
    <a href="#tech-stack">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="#tech-stack">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="#tech-stack">
      <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
    </a>
    <a href="#tech-stack">
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    </a>
  </p>
  
  <p>
    <em>The site serves as a professional showcase for skills, academic publications, certifications, and projects, backed by a secure admin panel for managing all content in real-time.</em>
  </p>
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

This is not a traditional static portfolio. The frontend is a statically exported **Next.js SPA** that fetches all of its content — skills, publications, certifications, projects, and social links — from a **PHP/MySQL REST API** at runtime. An integrated admin dashboard allows full CRUD management of every section, file uploads, avatar cropping, and visitor analytics.

The public-facing site is a single-page application with six core sections:

1. **Hero** — Introduction with "Mizanur Rahman" branding, availability badge, profile photo, and resume download.
2. **Technical Skills** — Categorized skill grid (Technical + Additional) with auto-mapped SVG icons.
3. **Publications** — Academic research cards with abstracts, research highlights, tech stack pills, and document links.
4. **Certifications** — Verified credentials from NSDA, British Council, and BCC with skill chips and credential downloads.
5. **Projects** — Featured and standard project cards with thumbnails, feature lists, stats, and external links.
6. **Contact** — Rich text form submission powered by a PHP backend endpoint with topic chips and inline icons.

---

## 🚀 Key Features

### 🌟 Public Site
- **Glassmorphism UI** with frosted glass panels, layered background glows, and gradient accents.
- **Dark & Light Theme** support with full CSS variable toggling via `[data-theme]`.
- **Fluid Typography** using `clamp()` for seamless scaling from 360px to 4K.
- **Framer Motion** scroll-triggered animations, staggered reveals, and hover micro-interactions.
- Sticky navigation bar with smooth anchor scrolling and a mobile hamburger menu.
- Theme-aware hero title hover — "Mizanur" turns white in dark mode, black in light mode; "Rahman" retains gradient effect.
- Custom glassmorphism tooltip on scroll-to-top button with slide-in animation and directional arrow.
- Floating social sidebar with dynamic links fetched from the API.

### 📱 Mobile Responsiveness
- Dedicated breakpoints (360px, 480px, 640px, 768px, 834px, 1024px, and 1440px+).
- Mobile hamburger menu with opaque theme-aware background.
- Responsive contact form with perfectly centered icons inside inputs.
- Responsive profile image sizing and hero layout with `wrap-reverse` stacking.

### 🔐 Admin Panel (`/secure-panel`)
- Session-based authentication with **CSRF token protection**.
- Command Center dashboard with traffic overview, portfolio summary, and content counts.
- **Analytics charts (Recharts)** and activity feed.
- Full **CRUD management** for Skills, Publications, Certifications, Projects, and Social Links.
- Rich text editor (React Quill) and image upload with crop modal (react-easy-crop).
- Collapsible sidebar navigation with real-time clock.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.2.9 (App Router, static export)
- **Library:** React 19.2.4
- **Language:** TypeScript 5
- **Styling:** Vanilla CSS (CSS custom properties, `color-mix()`, glassmorphism)
- **Animations:** Framer Motion 12
- **Icons:** Lucide React
- **Charts:** Recharts 3
- **Rich Text:** react-quill-new

### Backend & Deployment
- **API:** PHP (REST endpoints)
- **Database:** MySQL (via PHP PDO)
- **Deployment:** FTP upload (basic-ftp) to InfinityFree

---

## 📁 Project Structure

<details>
<summary>Click to expand project structure</summary>

```text
myself_mizan/
├── public/
│   ├── api/                    # PHP REST API endpoints
│   ├── uploads/                # User-uploaded media
│   ├── profile.png             # Profile photo
│   └── logo.png                # Signature logo
├── scripts/
│   └── deploy.js               # FTP deployment script
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, theme, glows)
│   │   ├── globals.css         # Full design system (light/dark tokens)
│   │   ├── page.tsx            # Main portfolio SPA
│   │   ├── secure-login/       # Admin login page
│   │   └── secure-panel/       # Admin dashboard
│   ├── components/
│   │   ├── ui/                 # Public-facing components
│   │   ├── admin/              # Admin-only components
│   │   └── shared/             # Cross-cutting components
│   └── lib/
│       ├── auth.ts             # Client-side auth utilities
│       └── sanitize.ts         # HTML sanitization wrapper
├── .env                        # Environment variables
└── next.config.ts              # Static export config
```
</details>

---

## 💻 Getting Started

### Prerequisites
- **Node.js** 18+
- **npm** (or yarn / pnpm / bun)
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

> Open [http://localhost:3000](http://localhost:3000) to view the site. Ensure your local PHP server or production API URL is properly configured.

### Build

```bash
npm run build
```
Generates a fully static export in the `out/` directory, ready for deployment.

---

## 🔐 Admin Panel

The admin panel is accessible at `/secure-login`. After authenticating, users are redirected to `/secure-panel`, offering:

- 📊 **Dashboard** — Real-time stats for page views, unique visitors, and content counts.
- 📝 **Content Management** — Create, edit, and delete portfolio items.
- ⚙️ **Site Settings** — Configure hero text, footer text, and other site-wide options.
- 🖼️ **Media Uploads** — Upload images/documents and crop avatars.
- 📬 **Messages** — View contact form submissions.

All admin routes are protected by `AuthGuard` which verifies session authentication and CSRF tokens.

---

## 🚀 Deployment

The project includes a streamlined deployment script that builds and uploads to InfinityFree via FTP:

```bash
npm run build
npm run deploy
```

*(This uses `scripts/deploy.js` to perform an additive upload, preserving existing server files like media and APIs).*

---

## 🎨 Design System

The visual identity is defined entirely through CSS custom properties in `globals.css`:
- **Colors:** Primary blue (`#3B82F6`), accent purple (`#8B5CF6`) with computed alpha variants.
- **Glass Panels:** Multi-depth frosted glass using `backdrop-filter: blur()`.
- **Typography:** Inter (body text), Space Grotesk (accents) utilizing fluid `clamp()` sizing.
- **Animations:** Framer Motion for scroll reveals, staggered lists, and spring transitions.

---

## 📄 License

This project is the personal portfolio of **Mizanur Rahman**. All rights reserved.

<div align="center">
  <p><em>Built with ❤️ and passion by Mizanur Rahman.</em></p>
</div>
