import { Inter } from 'next/font/google';
import Nav from '@/components/Nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js with SQLite',
  description: 'Demo showing Next.js with SQLite',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Nav />
        <main className="flex min-h-screen flex-col items-center p-24">
          {children}
        </main>
      </body>
    </html>
  );
}
