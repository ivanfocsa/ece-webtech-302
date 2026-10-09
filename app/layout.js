import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'DevBoard | Partage d Articles Tech & Veille Développeur',
  description:
    'Plateforme d échange et de publication d articles tech pour développeurs. Projet final du cours ECE WebTech 2026 Fall (Next.js 15, Supabase, Tailwind CSS 4).',
  keywords: ['Next.js 15', 'Supabase', 'Tailwind CSS 4', 'PostgreSQL', 'WebTech', 'ECE Paris'],
  authors: [{ name: 'Yvan FOCSA' }, { name: 'Emir Ben Hassen' }, { name: 'Kardiatou TOURE' }],
};

export const viewport = {
  themeColor: '#090d16',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
