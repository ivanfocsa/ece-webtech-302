import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import WeatherWidget from '@/components/WeatherWidget';

// ISR : page statique régénérée au plus toutes les 60 secondes
export const revalidate = 60;

export default async function HomePage() {
  const articles = await getArticles({ limit: 6 });

  return (
    <div className="page space-y-12">
      <section className="space-y-4">
        <span className="badge">ISR · 60 s</span>
        <h1>Partage d&apos;articles et veille technique</h1>
        <p className="text-zinc-400 max-w-xl">
          Publiez, lisez et commentez des articles entre développeurs.
        </p>
        <WeatherWidget />
        <div className="flex gap-3 pt-2">
          <Link href="/articles" className="btn btn-primary">Voir les articles</Link>
          <Link href="/articles/new" className="btn btn-secondary">Écrire un article</Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2>Articles récents</h2>
          <Link href="/articles" className="link text-sm">Tout voir</Link>
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
