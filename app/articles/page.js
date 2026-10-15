import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

export default async function ArticlesPage({ searchParams }) {
  const params = (await searchParams) || {};
  const query = params.q || '';
  const articles = await getArticles({ query });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Catalogue d'Articles</h1>
        <Link href="/articles/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
          + Rédiger un article
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
