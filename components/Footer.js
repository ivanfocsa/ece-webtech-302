import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-black text-zinc-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">DevBoard</div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Projet ECE WebTech 2026. Next.js 15, PostgreSQL et Tailwind CSS.
            </p>
          </div>

          <nav className="flex items-center space-x-4 text-xs">
            <Link href="/articles" className="hover:text-white transition-colors">
              Articles
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-zinc-500">
          <p>© 2026 Groupe Focsa, Touré, Ben Hassen.</p>
          <div className="flex space-x-3">
            <a href="https://github.com/ivanfocsa" target="_blank" rel="noreferrer" className="hover:text-zinc-300">
              Yvan Focsa
            </a>
            <span>•</span>
            <a href="https://github.com/Kardiatou0" target="_blank" rel="noreferrer" className="hover:text-zinc-300">
              Kardiatou Touré
            </a>
            <span>•</span>
            <a href="https://github.com/Emirates917" target="_blank" rel="noreferrer" className="hover:text-zinc-300">
              Emir Ben Hassen
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
