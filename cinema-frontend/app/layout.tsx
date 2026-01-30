import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import CinematicLoader from '../components/ui/CinematicLoader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Beirut Souks Cinemacity | Premium Experience',
  description: 'Book your tickets for the ultimate cinema experience.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-cinema-black text-white min-h-screen selection:bg-gold-500 selection:text-black">
        <CinematicLoader />
        {children}
      </body>
    </html>
  );
}
