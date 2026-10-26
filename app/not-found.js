import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="text-3xl font-mono text-zinc-500 font-bold">404</div>
      <h1 className="text-xl font-bold text-white tracking-tight">Page introuvable</h1>
      <p className="text-xs text-zinc-400">
        La ressource demandée n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-2 rounded text-xs font-medium bg-white hover:bg-zinc-200 text-black transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
