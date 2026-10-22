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
        'Design system avec Tailwind CSS 4, layout responsive avec menu mobile, LikeButton optimiste, CommentSection réactive, intégration Open-Meteo.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <header className="space-y-4 border-b border-slate-800 pb-8">
        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          SSG (Static Site Generation)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">À Propos de DevBoard</h1>
        <p className="text-slate-400 text-base leading-relaxed">
          DevBoard est le projet final développé par notre groupe de 3 étudiants dans le cadre du
          cours{' '}
          <a
            href="https://github.com/adaltas/ece-webtech-2026-fall"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            ECE WebTech 2026 Fall
          </a>{' '}
          {"dispensé par les intervenants d'Adaltas à l'ECE Paris."}
        </p>
      </header>

      {/* Équipe */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">{"L'Équipe du Projet"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.name}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-white text-base">{member.name}</h3>
                <p className="text-xs text-blue-400 font-medium mt-0.5">{member.role}</p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">{member.tasks}</p>
              </div>
              <a
                href={member.github}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1 pt-2 border-t border-slate-800/80"
              >
                <span>GitHub →</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Stack & Choix d'Architecture */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">{"Choix Techniques & Philosophie"}</h2>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            {"Notre consigne d'équipe a été : "}<strong>Zéro Overkill, Simplicité et Performance</strong>.
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li>
              <strong className="text-slate-200">JavaScript standard et lisible</strong> : Pas de sur-typage complexe ou d&apos;abstractions opaques pouvant ralentir l&apos;explication orale.
            </li>
            <li>
              <strong className="text-slate-200">Next.js 15 App Router</strong> : Utilisation des Server Components pour le SEO et le bundle minimal, combiné aux Client Components ciblés.
            </li>
            <li>
              <strong className="text-slate-200">PostgreSQL pur & Supabase RLS</strong> : Pas d&apos;ORM lourd (comme Prisma). Les requêtes SQL et politiques RLS garantissent la sécurité au niveau de la base de données.
            </li>
            <li>
              <strong className="text-slate-200">Tailwind CSS 4</strong> : Moteur Oxide en Rust sans fichier de configuration JavaScript verbeux.
            </li>
          </ul>
        </div>
      </section>

      {/* Liens documentation */}
      <section className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white text-sm">Documentation Complète pour la Soutenance</h3>
          <p className="text-xs text-slate-400">{"Consultez les fichiers d'architecture, de rendu et d'auth."}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/articles"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Voir les Articles
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}
