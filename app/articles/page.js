import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

// SSR : searchParams rend la page dynamique, la liste est filtrée côté serveur à chaque requête
const categories = ['Toutes', 'Frontend', 'Backend', 'DevOps', 'Architecture', 'Sécurité'];

export default async function ArticlesPage({ searchParams }) {
  const params = (await searchParams) || {};
  const query = params.q || '';
  const category = params.category || 'Toutes';

  const articles = await getArticles({ query, category });

  const hrefFor = (cat) => {
    const sp = new URLSearchParams();
    if (cat !== 'Toutes') sp.set('category', cat);
    if (query) sp.set('q', query);
    const qs = sp.toString();
    return qs ? `/articles?${qs}` : '/articles';
  };

  return (
    <div className="page space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="badge">SSR</span>
          <h1>Articles</h1>
        </div>
        <Link href="/articles/new" className="btn btn-primary">Écrire un article</Link>
      </div>

      <div className="space-y-3">
        <form action="/articles" className="flex gap-2 max-w-md">
          <input name="q" defaultValue={query} placeholder="Rechercher..." className="input" />
          {category !== 'Toutes' && <input type="hidden" name="category" value={category} />}
          <button type="submit" className="btn btn-secondary">Chercher</button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={hrefFor(cat)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                category === cat ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Aucun article trouvé. <Link href="/articles" className="underline">Réinitialiser</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
