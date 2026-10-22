import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getArticles } from '@/lib/articles';

// ==============================================================================
// 3. STRATÉGIE SSR DYNAMIQUE (Server-Side Rendering avec Cookies d'Auth)
// Lit la session utilisateur via les cookies HTTP sécurisés.
// ==============================================================================

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/profile');
  }

  const allArticles = await getArticles();
  const userArticles = allArticles.filter((a) => a.user_id === user.id);
  const totalLikes = userArticles.reduce((acc, curr) => acc + (curr.likes_count || 0), 0);

  const provider = user.app_metadata?.provider || 'Email';
  const fullName = user.user_metadata?.full_name || user.email.split('@')[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Carte d'identité utilisateur */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
            {fullName[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{fullName}</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {provider === 'github' ? 'GitHub OAuth' : 'Email Verified'}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">ID: {user.id}</p>
          </div>
        </div>

        <Link
          href="/articles/new"
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
        >
          + Rédiger un article
        </Link>
      </div>

      {/* Statistiques d'activité */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Articles rédigés
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{userArticles.length}</div>
        </div>
        <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Likes reçus au total
          </div>
          <div className="text-3xl font-extrabold text-rose-400 mt-2">{totalLikes}</div>
        </div>
        <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Mode de Rendu
          </div>
          <div className="text-lg font-bold text-purple-400 mt-2">{"SSR (Cookies d'auth)"}</div>
        </div>
      </div>

      {/* Liste des articles rédigés */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Vos publications</h2>

        {userArticles.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
            <p className="text-sm text-slate-400">Vous n&apos;avez pas encore publié d&apos;article.</p>
            <Link
              href="/articles/new"
              className="inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white"
            >
              Publier mon premier article
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {userArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-base font-bold text-white hover:text-blue-400 transition-colors"
                  >
                    {article.title}
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/articles/${article.id}/edit`}
                    className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    Modifier
                  </Link>
                  <Link
                    href={`/articles/${article.id}`}
                    className="px-3 py-1.5 rounded text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
