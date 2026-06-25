# Mizanur Rahman — Portfolio

A full-stack personal portfolio and content management system built with Next.js and PHP. The site serves as a professional showcase for skills, academic publications, certifications, and projects, backed by a secure admin panel for managing all content in real time.

**Live site:** Hosted on InfinityFree via static export + PHP API backend.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)
- [Design System](#design-system)
- [License](#license)

---

## Overview

This is not a traditional static portfolio. The frontend is a statically exported Next.js SPA that fetches all of its content — skills, publications, certifications, projects, and social links — from a PHP/MySQL REST API at runtime. An integrated admin dashboard allows full CRUD management of every section, file uploads, avatar cropping, and visitor analytics.

The public-facing site is a single-page application with five core sections:

1. **Hero** — Introduction, availability badge, profile photo, and resume download.
2. **Technical Skills** — Categorized skill grid (Technical + Additional) with auto-mapped SVG icons.
3. **Publications** — Academic research cards with abstracts, research highlights, tech stack pills, and document links.
4. **Certifications** — Verified credentials from NSDA, British Council, and BCC with skill chips and credential downloads.
5. **Projects** — Featured and standard project cards with thumbnails, feature lists, stats, and external links.
6. **Contact** — Form submission powered by a PHP backend endpoint.

---

## Key Features

### Public Site
- Glassmorphism UI with frosted glass panels, layered background glows, and gradient accents
- Dark and light theme support with full CSS variable toggling
- Fluid typography using `clamp()` for seamless scaling from 480px to 4K
- Framer Motion scroll-triggered animations, staggered reveals, and hover micro-interactions
- Sticky navigation bar with smooth anchor scrolling
- Floating social sidebar with dynamic links fetched from the API
- Scroll-to-top button with animated entrance/exit
- Skeleton loading states for all data-driven sections
- Construction notice banner (toggleable)
- Contact form with validation and backend submission
- View counter (production-only)

### Admin Panel (`/secure-panel`)
- Session-based authentication with CSRF token protection
- Command Center dashboard with traffic overview, portfolio summary, and content counts
- Analytics charts (Recharts) and activity feed
- Full CRUD management for: Skills, Publications, Certifications, Projects, Social Links
- Rich text editor (React Quill) for publication content
- Image upload with crop modal (react-easy-crop)
- Admin avatar management
- Security settings page
- Message inbox for contact form submissions
- Collapsible sidebar navigation with real-time clock

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Vanilla CSS (CSS custom properties, CSS Modules) |
| Fonts | Inter, Space Grotesk (Google Fonts via `next/font`) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Rich Text | react-quill-new |
| Image Crop | react-easy-crop |
| Sanitization | DOMPurify |
| Backend API | PHP (REST endpoints) |
| Database | MySQL (via PHP PDO) |
| Deployment | FTP upload (basic-ftp) to InfinityFree |

---

## Project Structure

```
myself_mizan/
├── public/
│   ├── api/                    # PHP REST API endpoints
│   │   ├── auth.php            # Authentication & CSRF
│   │   ├── db.php              # Database connection
│   │   ├── skills.php          # Skills CRUD
│   │   ├── publications.php    # Publications CRUD
│   │   ├── certifications.php  # Certifications CRUD
│   │   ├── projects.php        # Projects CRUD
│   │   ├── messages.php        # Contact form messages
│   │   ├── socials.php         # Social links CRUD
│   │   ├── settings.php        # Site settings
│   │   ├── stats.php           # View counter
│   │   ├── avatar.php          # Admin avatar upload
│   │   ├── upload.php          # File upload handler
│   │   └── contact.php         # Contact form endpoint
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
│   │   ├── page.module.css     # Page-specific styles
│   │   ├── secure-login/       # Admin login page
│   │   └── secure-panel/       # Admin dashboard
│   │       ├── layout.tsx      # Admin shell (sidebar, auth guard, clock)
│   │       ├── page.tsx        # Command Center dashboard
│   │       ├── skills/         # Skills management
│   │       ├── publications/   # Publications management
│   │       ├── certifications/ # Certifications management
│   │       ├── projects/       # Projects management
│   │       ├── socials/        # Social links management
│   │       ├── messages/       # Message inbox
│   │       └── security/       # Security settings
│   ├── components/
│   │   ├── ui/                 # Public-facing components
│   │   │   ├── GlassCard.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── StickyNav.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── SkillIcon.tsx
│   │   │   ├── AvailabilityBadge.tsx
│   │   │   ├── SocialSidebar.tsx
│   │   │   ├── SirenText.tsx
│   │   │   ├── ConstructionNotice.tsx
│   │   │   ├── AdminProfileCard.tsx
│   │   │   ├── ImageCropperModal.tsx
│   │   │   ├── RichEditor.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── admin/              # Admin-only components
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminCharts.tsx
│   │   │   ├── AdminClock.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── AuthGuard.tsx
│   │   └── shared/             # Cross-cutting components
│   │       ├── ThemeProvider.tsx
│   │       └── ThemeToggle.tsx
│   └── lib/
│       ├── auth.ts             # Client-side auth utilities
│       └── sanitize.ts         # HTML sanitization wrapper
├── next.config.ts              # Static export config
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm / bun)
- A PHP + MySQL server for the backend API (or use the live hosted API)

### Installation

```bash
git clone https://github.com/mizanur-sajid/myself_mizan.git
cd myself_mizan
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The frontend will attempt to fetch data from `/api/*.php` — in local development, you will need either a local PHP server or the production API URL.

### Build

```bash
npm run build
```

This generates a fully static export in the `out/` directory, ready for deployment to any static hosting provider.

---

## Admin Panel

The admin panel is accessible at `/secure-login`. After authenticating, users are redirected to `/secure-panel`, which provides:

- **Dashboard** — Real-time stats for page views, unique visitors, and content counts across all sections.
- **Content Management** — Dedicated pages for creating, editing, and deleting skills, publications, certifications, projects, and social links.
- **Media Uploads** — Upload images and documents for projects, publications, and certifications. Supports avatar cropping via react-easy-crop.
- **Messages** — View and manage contact form submissions.
- **Security** — Update admin credentials.

All admin routes are protected by `AuthGuard`, which checks session authentication and CSRF tokens before rendering.

---

## Deployment

The project includes a one-command deployment script that builds and uploads to InfinityFree via FTP:

```bash
npm run build
npm run deploy
```

The deploy script (`scripts/deploy.js`) connects to the InfinityFree FTP server and uploads the contents of `out/` to `/htdocs`. It performs an additive upload — existing files on the server (uploaded media, API scripts) are preserved.

---

## Design System

The visual identity is defined entirely through CSS custom properties in `globals.css`, supporting both light and dark themes:

- **Colors** — Primary blue (`#3B82F6`), accent purple (`#8B5CF6`), with computed alpha variants for glass layers.
- **Glass Panels** — Multi-depth frosted glass using `backdrop-filter: blur()` with dynamic opacity for light/dark modes.
- **Typography** — Inter for body text, Space Grotesk for monospaced/numeric accents. All sizing uses `clamp()` for fluid scaling.
- **Spacing & Layout** — Responsive grids via `auto-fit` / `minmax()`, with dedicated breakpoints for mobile, tablet, and widescreen.
- **Animations** — Framer Motion for scroll reveals, stagger effects, and spring-based transitions. CSS transitions for hover states and micro-interactions.

---

## License

This project is the personal portfolio of Mizanur Rahman. All rights reserved.

---

*Built by Mizanur Rahman.*
