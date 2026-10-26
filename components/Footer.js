import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-black text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Pitch */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
                ⚡
              </span>
              <span className="text-base font-bold text-white tracking-tight">DevBoard</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              Plateforme collaborative de veille technologique développée pour le cours{' '}
              <a
                href="https://github.com/adaltas/ece-webtech-2026-fall"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:underline underline-offset-4"
              >
                ECE WebTech 2026 Fall
              </a>
              . Architecture épurée Next.js 15, PostgreSQL & Tailwind CSS 4.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
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
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Auteurs
            </h3>
            <ul className="space-y-2 text-xs">
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
                  href="https://github.com/Kardiatou0"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Kardiatou TOURE (Backend)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Emirates917"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Emir Ben Hassen (Frontend)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>© 2026 DevBoard. Minimalist & Open Source.</p>
          <div className="flex space-x-3 mt-3 sm:mt-0 font-mono">
            <span>Next.js 15</span>
            <span>/</span>
            <span>Supabase</span>
            <span>/</span>
            <span>Tailwind 4</span>
            <span>/</span>
            <span>Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
