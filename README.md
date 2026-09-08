<div align="center">

# Mizanur Rahman : Portfolio

**A full-stack personal portfolio and content management system.**

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](#backend)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](#backend)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

A statically exported Next.js SPA paired with a PHP/MySQL REST API — showcasing skills, publications, certifications, and projects, backed by a secure admin dashboard.

</div>

---

## Overview

This is not a traditional static portfolio. The frontend is a statically exported **Next.js 16 SPA** that fetches all content from a **PHP/MySQL REST API** at runtime. An integrated admin dashboard provides full CRUD management of every section, file uploads, avatar cropping, and visitor analytics.

The public site is a single-page application with six sections:

| Section | Description |
|---|---|
| **Hero** | Animated availability badge, profile photo with gradient ring, resume viewer, and hero stats |
| **Skills** | Categorized skill grid with auto-mapped SVG icons |
| **Publications** | Research cards with abstracts, tech stack pills, and document links |
| **Certifications** | Verified credentials with skill chips and credential downloads |
| **Projects** | Featured and standard cards with thumbnails, feature lists, and external links |
| **Contact** | Form submission with topic chips and real-time validation |

---

## Features

### Public Site

- **Glassmorphism UI** — frosted glass panels with layered radial glows and gradient accents
- **Dual Themes** — light (warm editorial) and dark (obsidian aurora) with full CSS variable system
- **Fluid Typography** — `clamp()` sizing scaling seamlessly from 360px to 4K
- **Framer Motion** — scroll-triggered animations, staggered reveals, and hover micro-interactions
- **Smooth Scroll** — native-feeling inertia via Lenis
- **PDF Viewer** — in-browser résumé preview via pdf.js
- Animated gradient mesh background, sticky navigation, floating social sidebar

### Responsive Design

Dedicated breakpoints from 360px to 1440px+ with mobile hamburger nav, responsive forms, and fluid hero layout.

### Admin Panel

Accessible at `/secure-login` with session-based auth and CSRF protection.

| Section | Capability |
|---|---|
| **Dashboard** | Real-time page views, unique visitors, content counts, analytics charts |
| **Skills** | Add, edit, reorder, and delete skills |
| **Publications** | Manage research papers with rich text editor |
| **Certifications** | Manage credentials with file uploads |
| **Projects** | Featured/standard cards with thumbnails and links |
| **Socials** | Manage floating sidebar links |
| **Messages** | View contact form submissions |
| **Settings** | Configure hero text, footer, and site-wide options |
| **Security** | Change admin password |

All routes are protected by `AuthGuard` with session authentication and CSRF tokens.

---

## Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Library | React 19 |
| Language | TypeScript 5 |
| Styling | Vanilla CSS (custom properties, glassmorphism, fluid clamp) |
| Animations | Framer Motion 12 |
| Smooth Scroll | Lenis |
| Icons | Lucide React |
| Charts | Recharts |
| Rich Text | react-quill-new |
| Image Crop | react-easy-crop |
| PDF Viewer | pdfjs-dist |
| Auth Tokens | jose |

### Backend

| Category | Technology |
|---|---|
| API | PHP (REST endpoints, PDO) |
| Database | MySQL |
| Deploy | basic-ftp (FTP to InfinityFree) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn / pnpm)
- A **PHP + MySQL server** for the backend API (or use the live hosted API)

### Installation

```bash
git clone https://github.com/mizanur-sajid/myself_mizan.git
cd myself_mizan
npm install
npm run dev
```

> Open [http://localhost:3000](http://localhost:3000). Ensure your PHP server or production API URL is set correctly in `.env`.

### Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_BASE=https://your-api-domain.com/api
ENABLE_VIEW_COUNTER=false
```

### Build & Deploy

```bash
# Build the static export
npm run build

# Deploy to InfinityFree via FTP
npm run deploy
```

The build generates a fully static export in `out/`, and the deploy script uploads it to `/htdocs` on InfinityFree.

---

## License

This project is the personal portfolio of **Mizanur Rahman**. All rights reserved.

<div align="center">
  <sub>Built with care by Mizanur Rahman.</sub>
</div>
