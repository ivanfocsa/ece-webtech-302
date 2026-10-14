// Données initiales et de secours pour DevBoard (articles, commentaires, likes)
export const initialArticles = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Comprendre Next.js 15 et le nouveau paradigme de cache',
    slug: 'comprendre-nextjs-15-nouveau-cache',
    category: 'Frontend',
    summary: 'Analyse des changements majeurs apportés par Next.js 15 : fin du cache automatique par défaut et gestion asynchrone des paramètres.',
    content: `## Introduction

Next.js 15 introduit une rupture majeure par rapport à la version 14 : **les requêtes fetch et les routes ne sont plus mises en cache par défaut**. Cette décision résout des mois de confusion où les développeurs devaient systématiquement spécifier \`cache: 'no-store'\`.

### 1. searchParams et params asynchrones

Dans Next.js 15, \`params\` et \`searchParams\` deviennent des Promises résolues de façon asynchrone :

\`\`\`javascript
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const { query } = (await searchParams) || {};
  return <div>Article {id} - {query}</div>;
}
\`\`\`

### 2. Le support officiel de React 19

Next.js 15 apporte une intégration complète avec React 19, incluant les Server Actions stables et les nouveaux hooks d'action (\`useActionState\`, \`useOptimistic\`).

### Conclusion

Une version plus prévisible, plus proche des standards du web, et parfaitement taillée pour les applications modernes.`,
    user_id: '00000000-0000-0000-0000-000000000001',
    author_name: 'Yvan FOCSA',
    reading_time: '4 min',
    likes_count: 12,
    created_at: '2026-10-12T10:30:00Z',
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    title: 'Supabase vs Firebase : pourquoi PostgreSQL change la donne',
    slug: 'supabase-vs-firebase-guide-postgresql',
    category: 'Backend',
    summary: 'Comparatif technique approfondi entre Supabase et Firebase pour les applications web modernes nécessitant des relations complexes.',
    content: `## Le dilemme du BaaS moderne

Firebase a dominé le marché pendant une décennie avec son modèle document NoSQL (Firestore). Pourtant, l'essor de Supabase prouve la supériorité durable du modèle relationnel SQL.

### Les avantages clés de Supabase :

- **PostgreSQL pur** : Pas de dialecte propriétaire, accès direct aux triggers, fonctions PL/pgSQL et extensions.
- **Row Level Security (RLS)** : Sécurisation granulaire directement au niveau de la base plutôt que dans des règles applicatives séparées.
- **Pas de vendor lock-in** : Supabase est 100% open-source et auto-hébergeable.

\`\`\`sql
create policy "Auteurs seulement" on articles
  for update using (auth.uid() = user_id);
\`\`\`

Pour un projet d'école ou une startup ambitieuse, le choix est sans équivoque : PostgreSQL offre une évolutivité inégalée.`,
    user_id: '00000000-0000-0000-0000-000000000002',
    author_name: 'Emir Ben Hassen',
    reading_time: '5 min',
    likes_count: 18,
    created_at: '2026-10-15T14:15:00Z',
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    title: 'Pourquoi Tailwind CSS 4 réinvente le CSS utilitaire',
    slug: 'pourquoi-tailwind-css-4-reinvente-css',
    category: 'Frontend',
    summary: 'Retour d expérience sur Tailwind CSS 4 : disparition de tailwind.config.js, moteur Oxide en Rust et performances décuplées.',
    content: `## Un moteur entièrement réécrit en Rust

Tailwind CSS 4 marque l'évolution la plus importante du framework depuis sa création. Fini le fichier JavaScript \`tailwind.config.js\` lourd et complexe : toute la configuration réside désormais directement dans le CSS grâce à \`@theme\`.

### Ce qui change concrètement :

1. **Compilation instantanée** : Grâce au moteur Oxide écrit en Rust, le build est jusqu'à 10x plus rapide.
2. **Import unique** : Une seule ligne \`@import "tailwindcss";\` suffit à initialiser l'ensemble des styles.
3. **Modern CSS natif** : Exploitation poussée de \`@property\`, CSS nesting et des cascades layers standardisées.

L'expérience de développement sur DevBoard a été drastiquement simplifiée par cette refonte.`,
    user_id: '00000000-0000-0000-0000-000000000003',
    author_name: 'Kardiatou TOURE',
    reading_time: '3 min',
    likes_count: 24,
    created_at: '2026-10-18T09:20:00Z',
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    title: 'Sécuriser vos APIs avec Row Level Security (RLS) dans PostgreSQL',
    slug: 'securiser-apis-row-level-security-postgresql',
    category: 'Sécurité',
    summary: 'Comment déléguer l autorisation d accès aux données directement au moteur de base de données PostgreSQL sans failles.',
    content: `## Le principe de la sécurité au plus bas niveau

Dans une architecture web classique, la vérification des permissions est souvent dispersée dans des middlewares ou des contrôleurs d'API. Un oubli suffit pour exposer une ressource privée.

Avec **PostgreSQL Row Level Security (RLS)**, chaque ligne de table applique des prédicats booléens inviolables, quel que soit le client exécutant la requête.

### Démonstration pratique :

\`\`\`sql
alter table public.articles enable row level security;

create policy "Lecture publique"
  on public.articles for select
  using (true);

create policy "Modification par le propriétaire"
  on public.articles for update
  using (auth.uid() = user_id);
\`\`\`

Même si un utilisateur malveillant modifie les requêtes frontend, PostgreSQL rejette la transaction si \`auth.uid() != user_id\`.`,
    user_id: '00000000-0000-0000-0000-000000000002',
    author_name: 'Emir Ben Hassen',
    reading_time: '6 min',
    likes_count: 15,
    created_at: '2026-10-20T16:40:00Z',
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    title: 'Architecture Web Moderne : Server vs Client Components décryptés',
    slug: 'architecture-web-moderne-server-client-components',
    category: 'Architecture',
    summary: 'Guide pragmatique pour structurer vos applications Next.js sans tomber dans le piège du "tout client".',
    content: `## L équilibre Server vs Client

L'App Router de Next.js repose sur un paradigme simple mais souvent mal compris : **tous les composants sont des Server Components par défaut**.

### Règle d'or DevBoard :

- **Server Component** : Lecture des données dans Supabase, SEO, génération HTML statique (SSG/ISR), protection des secrets d'API.
- **Client Component (\`"use client"\`)** : Interactivité utilisateur (bouton Like, formulaire de commentaire réactif, menu hamburger responsive).

En découpant nos composants à la racine des interactions, nous préservons un bundle JavaScript minimal (First Load JS ~103 kB).`,
    user_id: '00000000-0000-0000-0000-000000000001',
    author_name: 'Yvan FOCSA',
    reading_time: '5 min',
    likes_count: 21,
    created_at: '2026-10-22T11:10:00Z',
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    title: 'CI/CD moderne pour Next.js avec GitHub Actions et Vercel',
    slug: 'cicd-moderne-nextjs-github-actions-vercel',
    category: 'DevOps',
    summary: 'Automatiser la validation de code, les tests RLS et le déploiement continu à chaque pull request.',
    content: `## Pourquoi automatiser votre pipeline ?

Dans un projet collaboratif à trois étudiants comme DevBoard, maintenir une branche \`main\` toujours déployable est un impératif. 

### Notre chaîne de déploiement :
1. **Lint & Typecheck** : Validation syntaxique avant tout commit.
2. **Build de production** : Vérification stricte que \`next build\` compile à 100%.
3. **Vercel Preview Deployments** : Chaque commit génère une URL de prévisualisation éphémère pour tester l'interface.`,
    user_id: '00000000-0000-0000-0000-000000000003',
    author_name: 'Kardiatou TOURE',
    reading_time: '4 min',
    likes_count: 9,
    created_at: '2026-10-24T15:00:00Z',
  },
];

export const initialComments = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    article_id: 'a1111111-1111-1111-1111-111111111111',
    author_name: 'Emir Ben Hassen',
    user_id: '00000000-0000-0000-0000-000000000002',
    content: 'Excellente analyse d Yvan sur Next.js 15. Le passage de searchParams en Promise simplifie énormément l architecture avec les Server Components.',
    created_at: '2026-10-13T11:20:00Z',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    article_id: 'a1111111-1111-1111-1111-111111111111',
    author_name: 'Kardiatou TOURE',
    user_id: '00000000-0000-0000-0000-000000000003',
    content: 'Totalement d accord ! Et combiné avec Tailwind CSS 4, le temps de compilation au build est bluffant.',
    created_at: '2026-10-14T09:45:00Z',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    article_id: 'a2222222-2222-2222-2222-222222222222',
    author_name: 'Yvan FOCSA',
    user_id: '00000000-0000-0000-0000-000000000001',
    content: 'Les politiques RLS de Supabase sont vraiment une arme secrète pour sécuriser les données directement en base sans écrire 50 lignes de middleware.',
    created_at: '2026-10-16T18:00:00Z',
  },
];
