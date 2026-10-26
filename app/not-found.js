import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
        🔍
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">Page Introuvable</h1>
      <p className="text-sm text-slate-400">
        {"L'article ou la ressource que vous recherchez n'existe pas ou a été déplacée."}
      </p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
      >
        {"Retourner à l'accueil"}
      </Link>
    </div>
  );
}
