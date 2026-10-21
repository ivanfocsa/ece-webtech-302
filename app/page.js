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
        <div className="flex justify-center mb-4">
          <WeatherWidget />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          {"L'Espace d'Échange des "}{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Développeurs Tech
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
          Découvrez, rédigez et débattez autour des dernières innovations : Next.js 15, PostgreSQL,
          Tailwind CSS 4, architectures cloud et sécurité.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/articles"
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
          >
            Explorer les articles →
          </Link>
          <Link
            href="/articles/new"
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105"
          >
            Publier un article
          </Link>
        </div>
      </section>

      {/* Statistiques clés */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
          <div>
            <div className="text-3xl font-extrabold text-blue-400">100%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Open Source</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-indigo-400">5</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Modes de Rendu</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-purple-400">RLS</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Sécurité PostgreSQL</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-400">Next.js 15</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">App Router & React 19</div>
          </div>
        </div>
      </section>

      {/* Articles récents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Articles à la Une</h2>
            <p className="text-sm text-slate-400">Dernières publications de la communauté DevBoard</p>
          </div>
          <Link
            href="/articles"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Tout voir →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Section Architecture Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Conçu selon les standards stricts du cours ECE WebTech
            </h2>
            <p className="text-sm text-slate-400">
              DevBoard démontre la maîtrise des concepts web avancés : rendu SSG, SSR dynamique, ISR,
              composants interactifs CSR, authentification OAuth 2.0 GitHub et sécurité matérielle Row Level Security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xl">⚡</span>
              <h3 className="font-semibold text-white text-sm mt-2">5 Stratégies de Rendu</h3>
              <p className="text-xs text-slate-400 mt-1">
                SSG (/about), SSG dynamique (/articles/[id]), SSR (/articles), ISR (/), CSR (/contact).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xl">🔒</span>
              <h3 className="font-semibold text-white text-sm mt-2">Sécurité RLS & OAuth</h3>
              <p className="text-xs text-slate-400 mt-1">
                Politiques PostgreSQL sur 4 tables et protection de routes par middleware Next.js.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xl">🌤️</span>
              <h3 className="font-semibold text-white text-sm mt-2">API Externe Open-Meteo</h3>
              <p className="text-xs text-slate-400 mt-1">
                Intégration temps réel de la météo parisienne sans clé propriétaire requise.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
