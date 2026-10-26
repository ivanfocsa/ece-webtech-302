-- ==============================================================================
-- DevBoard - Données de test (Seed) pour démonstration locale et Vercel
-- ==============================================================================

-- Insertion d'articles techniques réalistes
insert into public.articles (id, title, slug, category, summary, content, user_id, author_name, created_at)
values
  (
    'a1111111-1111-1111-1111-111111111111',
    'Comprendre Next.js 15 et le nouveau paradigme de cache',
    'comprendre-nextjs-15-nouveau-cache',
    'Frontend',
    'Analyse des changements majeurs apportés par Next.js 15 : fin du cache automatique par défaut et gestion asynchrone des paramètres.',
    '## Introduction\n\nNext.js 15 introduit une rupture majeure par rapport à la version 14 : **les requêtes fetch et les routes ne sont plus mises en cache par défaut**.\n\nCette décision résout des mois de confusion où les développeurs devaient systématiquement spécifier `cache: no-store`.\n\n### 1. searchParams et params asynchrones\n\nDans Next.js 15, `params` et `searchParams` deviennent des Promises :\n\n```javascript\nexport default async function Page({ params, searchParams }) {\n  const { id } = await params;\n  const { query } = (await searchParams) || {};\n  return <div>Article {id} - {query}</div>;\n}\n```\n\n### 2. Le support officiel de React 19\n\nNext.js 15 apporte une intégration complète avec React 19, incluant les Server Actions stables et les hooks d action (`useActionState`, `useOptimistic`).\n\n### Conclusion\n\nUne version plus prévisible, plus proche des standards du web, et parfaitement adaptée aux architectures serverless modernes.',
    '00000000-0000-0000-0000-000000000001',
    'Yvan FOCSA',
    now() - interval '14 days'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Supabase vs Firebase : pourquoi PostgreSQL change la donne',
    'supabase-vs-firebase-guide-postgresql',
    'Backend',
    'Comparatif technique approfondi entre Supabase et Firebase pour les applications web modernes nécessitant des relations complexes.',
    '## Le dilemme du BaaS moderne\n\nFirebase a dominé le marché pendant une décennie avec son modèle document NoSQL (Firestore). Pourtant, l essor de Supabase prouve la supériorité durable du modèle relationnel SQL.\n\n### Les avantages clés de Supabase :\n\n- **PostgreSQL pur** : Pas de dialecte propriétaire, accès direct aux triggers, fonctions PL/pgSQL et extensions.\n- **Row Level Security (RLS)** : Sécurisation granulaire directement au niveau de la base plutôt que dans des règles applicatives séparées.\n- **Pas de vendor lock-in** : Supabase est 100% open-source et auto-hébergeable.\n\n```sql\ncreate policy "Auteurs seulement" on articles\n  for update using (auth.uid() = user_id);\n```\n\nPour un projet moderne comme DevBoard, Supabase s impose comme le choix naturel.',
    '00000000-0000-0000-0000-000000000002',
    'Emir Ben Hassen',
    now() - interval '10 days'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Pourquoi Tailwind CSS 4 réinvente le CSS utilitaire',
    'pourquoi-tailwind-css-4-reinvente-css',
    'Frontend',
    'Retour d expérience sur Tailwind CSS 4 : disparition de tailwind.config.js, moteur Oxide en Rust et performances décuplées.',
    '## Un moteur entièrement réécrit en Rust\n\nTailwind CSS 4 marque l évolution la plus importante du framework depuis sa création. Fini le fichier JavaScript `tailwind.config.js` lourd et complexe : toute la configuration réside désormais directement dans le CSS grâce à `@theme`.\n\n### Ce qui change concrètement :\n\n1. **Compilation instantanée** : Grâce au moteur Oxide écrit en Rust, le build est jusqu à 10x plus rapide.\n2. **Import unique** : Une seule ligne `@import "tailwindcss";` suffit à initialiser l ensemble des styles.\n3. **Modern CSS natif** : Exploitation poussée de `@property`, CSS nesting et des cascades layers standardisées.\n\nL expérience de développement sur DevBoard a été drastiquement simplifiée par cette refonte.',
    '00000000-0000-0000-0000-000000000003',
    'Kardiatou TOURE',
    now() - interval '7 days'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Sécuriser vos APIs avec Row Level Security (RLS) dans PostgreSQL',
    'securiser-apis-row-level-security-postgresql',
    'Sécurité',
    'Comment déléguer l autorisation d accès aux données directement au moteur de base de données PostgreSQL sans failles.',
    '## Le principe de la sécurité au plus bas niveau\n\nDans une architecture web classique, la vérification des permissions est souvent dispersée dans des middlewares ou des contrôleurs d API. Un oubli suffit pour exposer une ressource.\n\nAvec **PostgreSQL Row Level Security (RLS)**, chaque ligne de table applique des prédicats booléens inviolables, quel que soit le client exécutant la requête.\n\n### Démonstration pratique :\n\n```sql\nalter table public.articles enable row level security;\n\ncreate policy "Lecture publique"\n  on public.articles for select\n  using (true);\n\ncreate policy "Modification par le propriétaire"\n  on public.articles for update\n  using (auth.uid() = user_id);\n```\n\nMême si un utilisateur malveillant modifie les requêtes frontend, PostgreSQL rejette la transaction si `auth.uid() != user_id`.',
    '00000000-0000-0000-0000-000000000002',
    'Emir Ben Hassen',
    now() - interval '4 days'
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'Architecture Web Moderne : Server vs Client Components décryptés',
    'architecture-web-moderne-server-client-components',
    'Architecture',
    'Guide pragmatique pour structurer vos applications Next.js sans tomber dans le piège du "tout client".',
    '## L équilibre Server vs Client\n\nL App Router de Next.js repose sur un paradigme simple mais souvent mal compris : **tous les composants sont des Server Components par défaut**.\n\n### Règle d or DevBoard :\n\n- **Server Component** : Lecture des données dans Supabase, SEO, génération HTML statique (SSG/ISR), protection des secrets d API.\n- **Client Component (`"use client"`)** : Interactivité utilisateur (bouton Like, formulaire de commentaire réactif, menu hamburger responsive).\n\nEn découpant nos composants à la racine des interactions, nous préservons un bundle JavaScript minimal (First Load JS ~103 kB).',
    '00000000-0000-0000-0000-000000000001',
    'Yvan FOCSA',
    now() - interval '2 days'
  );
