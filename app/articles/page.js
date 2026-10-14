import Link from 'next/link';
import { getArticles } from '@/lib/articles';

export default async function ArticlesPage({ searchParams }) {
  const params = (await searchParams) || {};
  const query = params.q || '';
  const articles = await getArticles({ query });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-white">Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((a) => (
          <div key={a.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
            <h2 className="text-lg font-bold text-white">{a.title}</h2>
            <p className="text-sm text-slate-400">{a.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
