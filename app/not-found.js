import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-12 h-12 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xl mx-auto">
        404
      </div>
      <h1 className="text-2xl font-bold text-white tracking-tight">Page Introuvable</h1>
      <p className="text-xs text-zinc-400">
        {"L'article ou la ressource que vous recherchez n'existe pas ou a été déplacée."}
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-2 rounded-md text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition-colors"
      >
        {"Retourner à l'accueil"}
      </Link>
    </div>
  );
}
