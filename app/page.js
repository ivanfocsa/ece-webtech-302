import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import WeatherWidget from '@/components/WeatherWidget';

// ==============================================================================
// 4. STRATÉGIE ISR (Incremental Static Regeneration)
// La page d'accueil est revalidée automatiquement toutes les 60 secondes.
// ==============================================================================
export const revalidate = 60;

export default async function HomePage() {
  const articles = await getArticles({ limit: 4 });

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="flex justify-center mb-2">
          <WeatherWidget />
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          L&apos;Espace d&apos;Échange des Développeurs Tech
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Partage, retours d&apos;expérience et débats autour des technologies modernes : Next.js 15, PostgreSQL,
          Tailwind CSS 4 et architectures cloud.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/articles"
            className="px-5 py-2.5 rounded-md text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition-colors"
          >
            Explorer les articles →
          </Link>
          <Link
            href="/articles/new"
            className="px-5 py-2.5 rounded-md text-xs font-medium bg-zinc-950 hover:bg-zinc-900 text-zinc-200 border border-zinc-800 transition-colors"
          >
            Publier un article
          </Link>
        </div>
      </section>

      {/* Statistiques clés */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-lg bg-zinc-950 border border-zinc-800 text-center font-mono">
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1">Open Source</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1">Modes de Rendu</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">RLS</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1">Sécurité PostgreSQL</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">0 ms</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1">Overkill</div>
          </div>
        </div>
      </section>

      {/* Section Articles Récents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              ISR (revalidate = 60s)
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">Dernières publications</h2>
          </div>
          <Link
            href="/articles"
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Tout voir →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
