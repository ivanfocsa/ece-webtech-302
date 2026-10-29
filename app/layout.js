import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'DevBoard',
  description: 'Partage d’articles techniques entre développeurs. Projet ECE WebTech 2026 (Next.js 15, Supabase, Tailwind CSS 4).',
  authors: [{ name: 'Yvan FOCSA' }, { name: 'Kardiatou TOURE' }, { name: 'Emir Ben Hassen' }],
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col selection:bg-white selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
