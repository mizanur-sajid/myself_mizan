import type { Metadata } from 'next';
import { ThemeProvider } from '../components/shared/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Futuristic Portfolio',
  description: 'Welcome to my elegant and futuristic portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
