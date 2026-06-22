import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '../components/shared/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'Mizan | Portfolio',
  description: 'Premium futuristic portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">
        <div className="bg-elements">
          <div className="glow glow-1"></div>
          <div className="glow glow-2"></div>
        </div>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
