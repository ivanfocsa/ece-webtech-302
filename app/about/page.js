import Link from 'next/link';

// SSG : aucune donnée dynamique, la page est générée une seule fois au build
const members = [
  { name: 'Yvan FOCSA', role: 'Lead, architecture, auth et déploiement', github: 'https://github.com/ivanfocsa' },
  { name: 'Kardiatou TOURE', role: 'Base de données, RLS et CRUD articles', github: 'https://github.com/Kardiatou0' },
  { name: 'Emir Ben Hassen', role: 'Interface Tailwind, composants et météo', github: 'https://github.com/Emirates917' },
];

const renderings = [
  { mode: 'SSG', page: '/about', href: '/about' },
  { mode: 'ISR (60 s)', page: '/', href: '/' },
  { mode: 'SSR', page: '/articles, /profile', href: '/articles' },
  { mode: 'CSR', page: '/contact, /login, /articles/new', href: '/contact' },
  { mode: 'SSG dynamique', page: '/articles/[id]', href: '/articles' },
];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-12">
      <div className="space-y-3">
        <span className="badge">SSG</span>
        <h1>À propos</h1>
        <p className="text-zinc-400">
          DevBoard est notre projet du cours WebTech à l&apos;ECE. Un site simple de partage d&apos;articles
          qui montre les différents modes de rendu de Next.js 15, avec Supabase pour la base de données
          et l&apos;authentification.
        </p>
      </div>

      <section className="space-y-4">
        <h2>Modes de rendu</h2>
        <div className="card divide-y divide-zinc-900">
          {renderings.map((r) => (
            <Link key={r.mode} href={r.href} className="flex justify-between px-4 py-3 text-sm hover:bg-zinc-900/50">
              <span className="text-white">{r.mode}</span>
              <span className="font-mono text-zinc-500">{r.page}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2>Équipe</h2>
        <div className="space-y-3">
          {members.map((m) => (
            <a key={m.name} href={m.github} className="card p-4 flex justify-between gap-4 text-sm hover:border-zinc-600 transition-colors">
              <span className="text-white">{m.name}</span>
              <span className="text-zinc-500 text-right">{m.role}</span>
            </a>
          ))}
        </div>
      </section>

      <p className="text-sm text-zinc-500">Next.js 15, React 19, Supabase (PostgreSQL, Auth, RLS), Tailwind CSS 4, Vercel.</p>
    </div>
  );
}
