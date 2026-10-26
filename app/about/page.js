import Link from 'next/link';

export default function AboutPage() {
  const members = [
    {
      name: 'Yvan FOCSA',
      role: 'Lead & Architecture',
      github: 'https://github.com/ivanfocsa',
      tasks:
        'Configuration Next.js 15, authentification GitHub et par email, middleware de protection des routes et déploiement.',
    },
    {
      name: 'Kardiatou TOURE',
      role: 'Backend & Base de données',
      github: 'https://github.com/Kardiatou0',
      tasks:
        'Création des tables PostgreSQL sur Supabase, politiques de sécurité Row Level Security (RLS) et requêtes des articles.',
    },
    {
      name: 'Emir Ben Hassen',
      role: 'Frontend & Intégration',
      github: 'https://github.com/Emirates917',
      tasks:
        'Mise en page avec Tailwind CSS, barre de navigation, filtrage par catégorie, widget météo et formulaire de contact.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <header className="space-y-2 border-b border-zinc-800 pb-6">
        <span className="text-[11px] font-mono text-zinc-500">SSG (Static Site Generation)</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">À propos du projet</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          DevBoard est un projet développé pour le cours ECE WebTech. Le but est de créer un site de partage d&apos;articles techniques avec authentification, droits d&apos;accès et rendu dynamique.
        </p>
      </header>

      {/* Membres de l'équipe */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white">Équipe du projet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {members.map((m) => (
            <div
              key={m.name}
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <h3 className="font-semibold text-white text-sm">{m.name}</h3>
                <div className="text-xs text-zinc-400 font-mono">{m.role}</div>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-zinc-900">
                  {m.tasks}
                </p>
              </div>

              <a
                href={m.github}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Voir GitHub →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies utilisées */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">Stack technique</h2>
        <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2 text-xs text-zinc-400">
          <p>
            L&apos;application est construite avec Next.js 15 en JavaScript standard. La persistance des données et la gestion des sessions utilisateurs reposent sur Supabase (PostgreSQL et Auth). L&apos;interface utilise Tailwind CSS 4.
          </p>
        </div>
      </section>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
        <Link href="/articles" className="text-zinc-400 hover:text-white transition-colors">
          ← Retour aux articles
        </Link>
        <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
