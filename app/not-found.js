import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <h1>Page introuvable</h1>
      <p className="text-sm text-zinc-400">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="btn btn-primary">Retour à l&apos;accueil</Link>
    </div>
  );
}
