import Link from 'next/link';

// ==============================================================================
// 1. STRATÉGIE SSG (Static Site Generation)
// Cette page informative est pré-rendue à 100% au build (aucun cookie ni paramètre).
// ==============================================================================

export default function AboutPage() {
  const members = [
    {
      name: 'Yvan FOCSA',
      role: 'Lead Developer / Architecture / Auth / Déploiement',
      github: 'https://github.com/ivanfocsa',
      tasks:
        "Conception de l'architecture globale Next.js 15, authentification GitHub OAuth & Email, middleware de protection des routes, stratégie ISR, intégration Vercel.",
    },
    {
      name: 'Kardiatou TOURE',
      role: 'Backend / Supabase / CRUD Articles',
      github: 'https://github.com/Kardiatou0',
      tasks:
        'Modélisation PostgreSQL (4 tables), politiques Row Level Security (RLS), seed data, clients @supabase/ssr, CRUD complet des articles et tests de sécurité.',
    },
    {
      name: 'Emir Ben Hassen',
      role: 'Frontend / Tailwind CSS 4 / Social & API',
      github: 'https://github.com/Emirates917',
      tasks:
        'Design system épuré avec Tailwind CSS 4, layout responsive avec menu mobile, LikeButton optimiste, CommentSection réactive, intégration Open-Meteo.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <header className="space-y-3 border-b border-zinc-800 pb-8">
        <span className="inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
          SSG (Static Site Generation)
        </span>
        <h1 className="text-3xl font-bold text-white tracking-tight">À Propos de DevBoard</h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
          DevBoard est le projet final développé par notre groupe de 3 étudiants dans le cadre du
          cours{' '}
          <a
            href="https://github.com/adaltas/ece-webtech-2026-fall"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:underline underline-offset-4"
          >
            ECE WebTech 2026 Fall
          </a>{' '}
          dispensé par Adaltas à l&apos;ECE Paris.
        </p>
      </header>

      {/* Cartes des membres */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">L&apos;Équipe du Projet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {members.map((m) => (
            <div
              key={m.name}
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-zinc-600 transition-colors"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center justify-center">
                  {m.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{m.name}</h3>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">{m.role}</div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-zinc-900">
                  {m.tasks}
                </p>
              </div>

              <a
                href={m.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs text-zinc-300 hover:text-white pt-2 font-mono"
              >
                GitHub →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Stack Technique & Objectifs */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Stack Technique & Règle d&apos;Or</h2>
        <div className="p-6 rounded-lg bg-zinc-950 border border-zinc-800 space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-white">Philosophie : Zéro Overkill.</strong> Aucune dépendance
            superflue, aucun ORM complexe, pas de Redux. Nous utilisons du JavaScript moderne standard,
            direct et compréhensible pour la soutenance orale.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-[11px]">
            <div className="p-3 rounded bg-black border border-zinc-900">
              <span className="text-white font-bold block">Next.js 15</span>
              <span className="text-zinc-500">App Router</span>
            </div>
            <div className="p-3 rounded bg-black border border-zinc-900">
              <span className="text-white font-bold block">Supabase</span>
              <span className="text-zinc-500">PostgreSQL & Auth</span>
            </div>
            <div className="p-3 rounded bg-black border border-zinc-900">
              <span className="text-white font-bold block">Tailwind CSS 4</span>
              <span className="text-zinc-500">Design Épuré</span>
            </div>
            <div className="p-3 rounded bg-black border border-zinc-900">
              <span className="text-white font-bold block">Vercel</span>
              <span className="text-zinc-500">Hébergement Cloud</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <Link href="/articles" className="text-xs text-zinc-400 hover:text-white transition-colors">
          ← Explorer les articles
        </Link>
        <Link
          href="/contact"
          className="px-4 py-2 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
