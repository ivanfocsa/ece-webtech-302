import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import WeatherWidget from '@/components/WeatherWidget';

export const revalidate = 60;

export default async function HomePage() {
  const articles = await getArticles({ limit: 6 });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* En-tête sobre */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <WeatherWidget />
          <span className="text-[11px] font-mono text-zinc-500">ISR (revalidate: 60s)</span>
        </div>

        <div className="space-y-2 pt-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Partage d&apos;articles et veille technique
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Application développée dans le cadre du cours ECE WebTech. Les articles sont stockés sur Supabase avec des règles d&apos;accès sécurisées par RLS.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/articles"
            className="px-4 py-2 rounded-md text-xs font-medium bg-white hover:bg-zinc-200 text-black transition-colors"
          >
            Tous les articles
          </Link>
          <Link
            href="/articles/new"
            className="px-4 py-2 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
          >
            Publier un article
          </Link>
        </div>
      </section>

      {/* Publications récentes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-semibold text-white">Articles récents</h2>
          <Link href="/articles" className="text-xs text-zinc-400 hover:text-white transition-colors">
            Voir tout ({articles.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
