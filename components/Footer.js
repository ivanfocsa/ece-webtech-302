import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Pitch */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                ⚡
              </span>
              <span className="text-lg font-bold text-white">DevBoard</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Plateforme collaborative d&apos;échange et de partage d&apos;articles tech conçue pour le cours{' '}
              <a
                href="https://github.com/adaltas/ece-webtech-2026-fall"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                ECE WebTech 2026 Fall
              </a>
              . Architecture moderne Next.js 15, PostgreSQL & Tailwind CSS 4.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  Explorer les articles
                </Link>
              </li>
              <li>
                <Link href="/articles/new" className="hover:text-white transition-colors">
                  Publier un article
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  À propos du projet
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Équipe */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Auteurs
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/ivanfocsa"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Yvan FOCSA (Lead)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Emirates917"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Emir Ben Hassen (Backend)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Kardiatou0"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Kardiatou TOURE (Frontend)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 DevBoard. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <span>Next.js 15</span>
            <span>•</span>
            <span>Supabase</span>
            <span>•</span>
            <span>Tailwind CSS 4</span>
            <span>•</span>
            <span>Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
