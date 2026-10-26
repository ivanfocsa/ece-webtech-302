# DevBoard

Projet final du cours ECE WebTech 2026. Plateforme de partage d'articles techniques avec authentification, base de données relationnelle et sécurité par utilisateur.

- **Site en ligne** : [https://ece-webtech-302.vercel.app](https://ece-webtech-302.vercel.app)
- **Grille d'évaluation** : voir [PROJECT.md](./PROJECT.md)

## Équipe

- Yvan Focsa : Lead, architecture Next.js 15, authentification, routes et déploiement.
- Kardiatou Touré : Modélisation PostgreSQL, configuration Supabase, politiques RLS et requêtes.
- Emir Ben Hassen : Interface Tailwind CSS, composants de navigation, widget météo et filtres.

## Stack technique

- Framework : Next.js 15 (App Router, React 19)
- Base de données et authentification : Supabase (PostgreSQL, Auth GitHub et email)
- Styles : Tailwind CSS 4
- Déploiement : Vercel

## Stratégies de rendu

1. SSG : `/about` (page statique générée au build)
2. SSG dynamique : `/articles/[id]` (pré-génération via `generateStaticParams`)
3. SSR : `/articles` (recherche avec searchParams) et `/profile` (session utilisateur)
4. ISR : `/` (accueil actualisée toutes les 60 secondes avec `revalidate = 60`)
5. CSR : `/contact`, `/login`, `/articles/new` (formulaires interactifs côté client)

## Installation locale

1. Cloner le projet :
```bash
git clone https://github.com/ivanfocsa/ece-webtech-302.git
cd ece-webtech-302
npm install
```

2. Configurer les variables dans un fichier `.env.local` :
```ini
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

3. Lancer le serveur :
```bash
npm run dev
```

L'application tourne sur [http://localhost:3000](http://localhost:3000).

## Base de données et sécurité

Le script SQL d'initialisation se trouve dans `supabase/schema.sql`. Il crée 4 tables (`articles`, `comments`, `likes`, `contacts`) avec Row Level Security activé :
- Tout le monde peut lire les articles et les commentaires.
- Seul l'auteur d'un article peut le modifier ou le supprimer (`auth.uid() = user_id`).
- Seuls les utilisateurs connectés peuvent liker ou commenter.
