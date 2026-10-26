import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/profile');
  }

  const allArticles = await getArticles();
  const userArticles = allArticles.filter((a) => a.user_id === user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profil */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              {user.user_metadata?.full_name || 'Utilisateur'}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              SSR
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">{user.email}</p>
        </div>

        <Link
          href="/articles/new"
          className="px-3.5 py-1.5 rounded text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          Nouvel article
        </Link>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-sm font-semibold text-white">Mes publications</h2>
          <span className="text-xs font-mono text-zinc-500">
            {userArticles.length} article{userArticles.length > 1 ? 's' : ''}
          </span>
        </div>

        {userArticles.length === 0 ? (
          <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
            <p className="text-xs text-zinc-400">
              Vous n&apos;avez pas encore publié d&apos;article.
            </p>
            <Link
              href="/articles/new"
              className="inline-block px-3 py-1.5 rounded text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
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
