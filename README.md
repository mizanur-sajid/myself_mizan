# Personal Portfolio & CMS

A modern, full-stack personal portfolio and Content Management System (CMS) built with Next.js, React, and Prisma. This project features a highly polished public-facing portfolio and a secure, deeply integrated administrative dashboard for managing content on the fly.

## Key Features

### Public Portfolio
* **Modern UI/UX**: Built with a sleek "glassmorphism" design system, smooth scroll tracking, and an iOS-style dynamic island navigation bar.
* **Responsive Layout**: Fully responsive design that adapts flawlessly to desktop, tablet, and mobile displays.
* **Dark/Light Mode**: Integrated theme toggling for user preference.
* **Live Contact Form**: Visitors can send messages directly through the platform, which are securely stored and readable via the admin panel.
* **Dynamic Sections**: Features dynamic displays for Expertise (Skills), Publications, and Certifications.

### Admin Command Center (`/admin`)
* **Secure Authentication**: Protected routes ensure only authorized access to the command center.
* **Live Analytics dashboard**: Tracks and displays lifetime portfolio views and aggregate data (total skills, messages, etc.).
* **Full CRUD CMS**: Create, Read, Update, and Delete capabilities for:
  * **Skills**: Manage technical proficiencies and matrices.
  * **Publications**: Showcase research, articles, and whitepapers with Rich Text descriptions.
  * **Certifications**: Upload and display professional certificates and badges.
* **Message Inbox**: Read and delete incoming communications from the public contact form.
* **Advanced Profile Management**: Includes a custom-built image cropper (using `react-easy-crop`) to allow precise editing and management of the administrator's profile picture.

## Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router)
* **UI/Components**: React, native CSS (for granular glassmorphism control)
* **Database & ORM**: [Prisma ORM](https://www.prisma.io/)
* **Icons**: `lucide-react`
* **Image Processing**: `react-easy-crop`

## Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd myself_mizan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   Push the Prisma schema to your database to create the required tables:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Environment Variables**
   Ensure you have a `.env` file configured with your database connection string and any required authentication secrets.
   ```env
   DATABASE_URL="file:./dev.db" # Example for SQLite
   ADMIN_PASSWORD="your-secure-password" # Set your admin password
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the public site.
7. Open [http://localhost:3000/admin](http://localhost:3000/admin) to log into the CMS.

## Architecture Highlights

* **Server & Client Components**: Strategically separates Next.js Server Components for secure database fetching (Prisma) and Client Components for rich interactivity (Image cropping, ScrollSpy nav).
* **API Routes**: Utilizes Next.js Route Handlers (`/api/*`) for handling client-side mutations (PUT, DELETE, POST) seamlessly.

## License
MIT
