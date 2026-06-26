# Mizanur Rahman — Portfolio

A full-stack personal portfolio and content management system built with Next.js and PHP. The site serves as a professional showcase for skills, academic publications, certifications, and projects, backed by a secure admin panel for managing all content in real time.

**Live site:** Hosted on InfinityFree via static export + PHP API backend.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Recent Updates](#recent-updates)
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

The public-facing site is a single-page application with six core sections:

1. **Hero** — Introduction with "Mizanur Rahman" branding, availability badge, profile photo, and resume download.
2. **Technical Skills** — Categorized skill grid (Technical + Additional) with auto-mapped SVG icons.
3. **Publications** — Academic research cards with abstracts, research highlights, tech stack pills, and document links.
4. **Certifications** — Verified credentials from NSDA, British Council, and BCC with skill chips and credential downloads.
5. **Projects** — Featured and standard project cards with thumbnails, feature lists, stats, and external links.
6. **Contact** — Rich text form submission powered by a PHP backend endpoint with topic chips and inline icons.

---

## Key Features

### Public Site
- Glassmorphism UI with frosted glass panels, layered background glows, and gradient accents
- Dark and light theme support with full CSS variable toggling via `[data-theme]`
- Fluid typography using `clamp()` for seamless scaling from 360px to 4K
- Framer Motion scroll-triggered animations, staggered reveals, and hover micro-interactions
- Sticky navigation bar with smooth anchor scrolling and mobile hamburger menu
- Theme-aware hero title hover — "Mizanur" turns white in dark mode, black in light mode; "Rahman" retains gradient effect
- Custom glassmorphism tooltip on scroll-to-top button with slide-in animation and directional arrow
- Floating social sidebar with dynamic links fetched from the API
- Scroll-to-top button with animated entrance/exit
- Skeleton loading states for all data-driven sections
- Construction notice banner (toggleable)
- Contact form with topic chips, inline icons, rich text editor, and backend submission
- View counter (production-only)

### Mobile Responsiveness
- Dedicated breakpoints for 360px, 480px, 640px, 768px, 834px, 1024px, and 1440px+
- Mobile hamburger menu with opaque theme-aware background (solid in both light and dark modes)
- Contact form icons properly centered inside inputs on all screen sizes
- Responsive profile image sizing and hero layout with `wrap-reverse` stacking

### Footer
- Compact footer with signature logo, "Made with ❤️ and passion by" tagline, and copyright notice
- Logo prominently sized larger than surrounding text lines
- Subtle glassmorphism card with rounded corners

### Admin Panel (`/secure-panel`)
- Session-based authentication with CSRF token protection
- Command Center dashboard with traffic overview, portfolio summary, and content counts
- Analytics charts (Recharts) and activity feed
- Full CRUD management for: Skills, Publications, Certifications, Projects, Social Links
- Site settings management (hero title, subtitle, footer text)
- Rich text editor (React Quill) for publication content
- Image upload with crop modal (react-easy-crop)
- Admin avatar management
- Security settings page
- Message inbox for contact form submissions
- Collapsible sidebar navigation with real-time clock

---

## Recent Updates

### Hero Section
- Hero title hardcoded to "Mizanur Rahman." — no longer dynamically overridden by config
- Hero subtitle hardcoded to the "Computer Science and IT Engineer..." description
- "Mizanur" wrapped in a dedicated `.hero-name-first` span with theme-aware hover colors:
  - **Light mode hover** → black (`#000000`)
  - **Dark mode hover** → white (`#FFFFFF`)
- "Rahman" retains the gradient effect (`--primary-color` → `--accent-color`) on hover

### Footer
- Removed the inline "Back to top" link from the footer
- Reduced "Made with ❤️ and passion by" text from `0.95rem` to `0.75rem`
- Reduced "© All Rights Reserved." text from `0.85rem` to `0.7rem`
- Increased signature logo from `120×35` to `160×48` for visual dominance

### Scroll-to-Top Button
- Replaced the native browser `title` tooltip with a custom glassmorphism tooltip
- Tooltip appears to the left of the button with a smooth slide-in animation
- Includes a directional arrow pointing toward the button
- Styled with `backdrop-filter: blur(20px)`, theme-aware colors, and rounded corners

### Mobile Menu (Dark Mode Fix)
- Fixed the mobile navigation menu being nearly transparent in dark mode
- Changed background from `var(--glass-bg-hover)` (8% opacity in dark mode) to `color-mix(in srgb, var(--bg-color) 95%, transparent)`
- Menu now properly covers page content behind it in both light and dark modes

### Contact Form (Mobile Fix)
- Removed the `.contact-flex { flex-direction: column !important }` CSS override that caused input icons to misalign on mobile
- The `flex-basis: 300px` was applying to **height** instead of width when direction was column, pushing icons 150px below center
- Form now uses natural `flex-wrap` for responsive stacking, keeping icons properly centered
- Added `height: fit-content` and `z-index: 1` to icon wrappers for additional robustness

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router, static export) |
| UI Library | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Vanilla CSS (CSS custom properties, `color-mix()`, glassmorphism) |
| Fonts | Inter, Space Grotesk (Google Fonts via `next/font`) |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Charts | Recharts 3 |
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
│   │   ├── config.php          # Site configuration
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
│   │       ├── settings/       # Site settings management
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
├── .env                        # Environment variables
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
- **Site Settings** — Configure hero title, subtitle, footer text, and other site-wide options.
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

The deploy script (`scripts/deploy.js`) connects to the InfinityFree FTP server and uploads the contents of `out/` to `/htdocs`. It performs an additive upload — existing files on the server (uploaded media, API scripts) are preserved. The `_not-found` directory is automatically cleaned up before upload.

---

## Design System

The visual identity is defined entirely through CSS custom properties in `globals.css`, supporting both light and dark themes via `[data-theme='dark']`:

- **Colors** — Primary blue (`#3B82F6` / `#2563EB`), accent purple (`#8B5CF6` / `#7C3AED`), with computed alpha variants for glass layers using `rgba()` and `color-mix()`.
- **Glass Panels** — Multi-depth frosted glass using `backdrop-filter: blur()` with dynamic opacity for light/dark modes. Mobile menu uses `color-mix()` for opaque backgrounds.
- **Typography** — Inter for body text, Space Grotesk for monospaced/numeric accents. All sizing uses `clamp()` for fluid scaling.
- **Spacing & Layout** — Responsive grids via `auto-fit` / `minmax()`, with dedicated breakpoints at 360px, 480px, 640px, 768px, 834px, 1024px, and 1440px.
- **Animations** — Framer Motion for scroll reveals, stagger effects, and spring-based transitions. CSS transitions for hover states and micro-interactions.
- **Custom Tooltips** — Glassmorphism tooltips with `backdrop-filter`, directional arrows, and slide-in animations replacing native browser tooltips.

---

## License

This project is the personal portfolio of Mizanur Rahman. All rights reserved.

---

*Built with ❤️ and passion by Mizanur Rahman.*
