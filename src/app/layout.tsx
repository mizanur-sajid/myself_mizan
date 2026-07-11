import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import { ThemeProvider } from '../components/shared/ThemeProvider';
import './globals.css';

const inter = DM_Sans({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Manrope({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mizan | Portfolio',
  description: 'Premium futuristic portfolio',
};

import { ConstructionNotice } from '@/components/ui/ConstructionNotice';
import { SocialSidebar } from '@/components/ui/SocialSidebar';
import { SmoothScrolling } from '@/components/shared/SmoothScrolling';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <div className="bg-elements">
          <div className="glow glow-1"></div>
          <div className="glow glow-2"></div>
        </div>
        <div className="bg-noise"></div>
        <ThemeProvider>
          <SmoothScrolling>
            {children}
            <ConstructionNotice />
            <SocialSidebar />
          </SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}
