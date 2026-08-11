import type { Metadata } from 'next';
import { Archivo_Black, Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '../components/shared/ThemeProvider';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  variable: '--font-hero',
  weight: '400',
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
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${plusJakartaSans.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${archivoBlack.variable}`}>
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
