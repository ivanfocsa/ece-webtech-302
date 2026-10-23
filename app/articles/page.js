import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

// ==============================================================================
// 3. STRATÉGIE SSR (Server-Side Rendering)
// La présence de `searchParams` bascule cette page en mode dynamique (ƒ Dynamic).
// Le serveur filtre la base de données à chaque requête selon la recherche et la catégorie.
// ==============================================================================

const categories = ['Toutes', 'Frontend', 'Backend', 'DevOps', 'Architecture', 'Sécurité'];

export default async function ArticlesPage({ searchParams }) {
  const params = (await searchParams) || {};
  const query = params.q || '';
  const currentCategory = params.category || 'Toutes';

  const articles = await getArticles({
    query,
    category: currentCategory,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              SSR (Server-Side Rendering)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Catalogue d&apos;Articles</h1>
          <p className="text-sm text-slate-400">
            {articles.length} article{articles.length > 1 ? 's' : ''} trouvé{articles.length > 1 ? 's' : ''}
            {query && ` pour "${query}"`}
            {currentCategory !== 'Toutes' && ` dans ${currentCategory}`}
          </p>
        </div>

        <Link
          href="/articles/new"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
        >
          + Rédiger un article
        </Link>
      </div>

      {/* Barre de Recherche et Filtres par Catégorie */}
      <div className="space-y-4">
        {/* Formulaire de recherche avec GET natif */}
        <form method="GET" action="/articles" className="flex gap-2 max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Rechercher par mot-clé (ex: Next, Supabase, RLS)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          {currentCategory !== 'Toutes' && (
            <input type="hidden" name="category" value={currentCategory} />
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Rechercher
          </button>
        </form>

        {/* Pilules de catégories */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => {
            const isActive = currentCategory === cat;
            const href =
              cat === 'Toutes'
                ? query
                  ? `/articles?q=${encodeURIComponent(query)}`
                  : '/articles'
                : query
                ? `/articles?category=${cat}&q=${encodeURIComponent(query)}`
                : `/articles?category=${cat}`;

            return (
              <Link
                key={cat}
                href={href}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Liste des articles */}
      {articles.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-bold text-white">Aucun article ne correspond à votre recherche</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Essayez de modifier votre mot-clé ou réinitialisez le filtre de catégorie.
          </p>
          <Link
            href="/articles"
            className="inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
