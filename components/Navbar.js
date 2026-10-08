'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-blue-500">⚡</span> DevBoard
        </Link>
        <nav className="flex space-x-4 text-sm text-slate-300">
          <Link href="/" className="hover:text-white">Accueil</Link>
          <Link href="/articles" className="hover:text-white">Articles</Link>
          <Link href="/about" className="hover:text-white">À propos</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
