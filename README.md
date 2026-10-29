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


## Guide utilisateur

1. Consultez les articles depuis l'accueil ou la page Articles ; utilisez la recherche et les categories.
2. Connectez-vous par email ou GitHub pour publier, commenter et aimer un article.
3. Utilisez Rediger un article pour publier. Les boutons Modifier et Supprimer sont reserves a son auteur.
4. Retrouvez vos publications dans Profil. Le formulaire Contact permet d'envoyer un message prive a l'equipe.

## Configuration de la connexion locale

Prerequis : Node.js 20 ou plus recent et un projet Supabase dont le schema a ete initialise.
Copiez `.env.example` dans `.env.local`, puis renseignez l'URL du projet et la cle publique anon/publishable dans les variables indiquees. Ne placez jamais une cle service_role dans une variable NEXT_PUBLIC.
Le fichier `.env.local` est ignore par Git et ne doit pas etre publie.
Dans Supabase Auth, autorisez `http://localhost:3001/auth/callback` (ou le port local utilise) parmi les URL de redirection. Le fournisseur GitHub doit etre configure dans Supabase Auth pour utiliser la connexion GitHub.
Apres un changement de variables, reconstruisez et redemarrez le serveur de production, ou redemarrez le serveur de developpement.
Sans configuration, la lecture des articles utilise les donnees de demonstration ; la connexion n'est pas active.

## Corrections de securite pour une base existante

Executez `supabase/migrations/202610290001_contacts_privacy.sql` dans le SQL Editor Supabase. Cette migration conserve les messages et restreint leur lecture aux administrateurs identifies par `app_metadata.role = admin`. Ce role doit etre attribue exclusivement via un environnement de confiance ; les messages restent consultables par les responsables autorises dans le dashboard Supabase.
Modifier le fichier SQL dans Git ne modifie pas automatiquement la base de production.

## Verification

- `npm test` : tests de regression avec reponses Supabase simulees.
- `npm run build` : compilation de production.
- `supabase/tests/rls_test.sql` : test des permissions, de l'unicite des likes, de la confidentialite des contacts et de la cascade. A executer dans Supabase avec deux comptes existants ; les donnees de test sont annulees par une transaction.
Les tests locaux ne remplacent pas un essai complet avec deux comptes sur la base effectivement deployee.
