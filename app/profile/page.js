import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

// SSR : la session est lue dans les cookies à chaque requête
export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile');

  const articles = (await getArticles()).filter((a) => a.user_id === user.id);

  return (
    <div className="page space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="badge">SSR</span>
          <h1>{user.user_metadata?.full_name || 'Mon profil'}</h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
        <Link href="/articles/new" className="btn btn-primary">Écrire un article</Link>
      </div>

      <section className="space-y-4">
        <h2>Mes articles ({articles.length})</h2>
        {articles.length === 0 ? (
          <p className="text-sm text-zinc-500">Vous n&apos;avez encore rien publié.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
