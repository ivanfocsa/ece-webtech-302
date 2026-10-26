import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

// ==============================================================================
// 3. STRATÉGIE SSR (Server-Side Rendering) & ROUTE PRIVÉE
// Cette page lit les cookies d'authentification pour rendre les données utilisateur.
// ==============================================================================

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/profile');
  }

  // Récupérer les articles publiés par cet utilisateur
  const allArticles = await getArticles();
  const userArticles = allArticles.filter((a) => a.user_id === user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* En-tête profil */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-white text-black font-bold text-xl flex items-center justify-center">
            {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {user.user_metadata?.full_name || 'Développeur DevBoard'}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                SSR Authentifié
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{user.email}</p>
            <p className="text-[11px] text-zinc-500 font-mono mt-1">
              ID: {user.id.substring(0, 18)}...
            </p>
          </div>
        </div>

        <Link
          href="/articles/new"
          className="px-4 py-2 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          + Rédiger un nouvel article
        </Link>
      </div>

      {/* Mes publications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-white tracking-tight">Mes Articles</h2>
          <span className="text-xs font-mono text-zinc-400">
            {userArticles.length} publication{userArticles.length > 1 ? 's' : ''}
          </span>
        </div>

        {userArticles.length === 0 ? (
          <div className="p-10 text-center bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-white">Vous n&apos;avez pas encore publié d&apos;article</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Partagez votre première astuce ou tutoriel technique avec la communauté.
            </p>
            <Link
              href="/articles/new"
              className="inline-block px-4 py-2 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              Écrire mon premier article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
