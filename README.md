# DevBoard ⚡

> **Plateforme collaborative d'échange et partage d'articles tech pour développeurs passionnés.**  
> Projet final réalisé dans le cadre du cours **ECE WebTech 2026 Fall** (Adaltas / ECE Paris).

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ecf8e?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com/)

---

## 👥 Équipe de Réalisation (Groupe de 3 étudiants)

| Membre | Rôle & Responsabilités | Profil GitHub |
|---|---|---|
| **Yvan FOCSA** | **Lead / Architecture / Auth / Déploiement**<br>Architecture globale, configuration Next.js 15 & Tailwind 4, OAuth GitHub & Email/Password, Middleware de protection des routes, ISR page d'accueil, documentation technique. | [@ivanfocsa](https://github.com/ivanfocsa) |
| **Kardiatou TOURE** | **Backend / Supabase / CRUD Articles**<br>Conception PostgreSQL (4 tables), politiques Row Level Security (RLS), seed data, client serveur `@supabase/ssr`, CRUD complet des articles (liste SSR, lecture SSG, création, édition, suppression). | [@Kardiatou0](https://github.com/Kardiatou0) |
| **Emir Ben Hassen** | **Frontend / Tailwind / Social & API**<br>Composants de layout (Navbar responsive avec menu hamburger mobile, Footer), design system sombre, formulaire de contact CSR, LikeButton optimiste, CommentSection réactive, intégration météo Open-Meteo. | [@Emirates917](https://github.com/Emirates917) |

---

## 🚀 Fonctionnalités Clés

1. **Authentification Double Flux (OAuth 2.0 & Email)** :
   - Connexion instantanée via **GitHub** (flux OAuth 2.0 sécurisé avec PKCE / cookies).
   - Inscription et connexion par **Email / Mot de passe**.
   - Session utilisateur synchronisée et routes privées protégées par `middleware.js` (`/profile`, `/articles/new`, `/articles/[id]/edit`).

2. **CRUD Articles Complet & Sécurisé par RLS** :
   - **Create** : Création d'un article avec titre, catégorie, résumé, contenu et prévisualisation.
   - **Read** : Consultation publique ultra-rapide optimisée par SSG et SSR.
   - **Update** : Modification réservée strictement à l'auteur de l'article (`auth.uid() = user_id`).
   - **Delete** : Suppression sécurisée avec confirmation modale et cascade sur les commentaires / likes.

3. **Interactions Sociales Réactives (CSR)** :
   - **Système de Likes** : Bouton Like avec mise à jour optimiste et contrôle de dédoublonnage (`unique(article_id, user_id)`).
   - **Commentaires en direct** : Dépôt de commentaires avec identification de l'auteur et suppression par le propriétaire.

4. **API Externe en Temps Réel** :
   - Intégration de l'API publique **Open-Meteo** sur la page d'accueil (température, vent, humidité et météo en direct de Paris, sans clé d'API, 100% fiable).

5. **Recherche et Filtrage Dynamique** :
   - Moteur de recherche plein texte par titre et résumé.
   - Filtre par catégories techniques (`Frontend`, `Backend`, `DevOps`, `Architecture`, `Sécurité`).

---

## 📐 Démonstration des 5 Stratégies de Rendu Next.js

Le projet respecte à 100% les consignes pédagogiques du cours en implémentant les **5 modes de rendu** vérifiables dans le build :

| Stratégie | Route | Description & Justification |
|---|---|---|
| **SSG** (Statique pur) | `/about` | Pré-rendu au build pour une page informative ultra-rapide sans dépendance dynamique. |
| **SSG Dynamique** | `/articles/[id]` | Généré au build via `generateStaticParams()` pour un affichage instantané et un SEO parfait. |
| **SSR** (Serveur à la demande) | `/articles`<br>`/profile` | `/articles` consomme les `searchParams` en temps réel pour la recherche.<br>`/profile` lit les cookies de session utilisateur. |
| **ISR** (Régénération Incrémentale) | `/` | Page d'accueil mise à jour périodiquement grâce à `export const revalidate = 60`. |
| **CSR** (Client Interactif) | `/contact`<br>`/login`<br>`/articles/new` | Composants `'use client'` gérant les formulaires, la validation en direct et les states React. |

---

## 🛠️ Installation et Lancement Local

### Prérequis
- **Node.js** v18+ (testé sur Node v26)
- **npm** ou **pnpm**
- Un projet **Supabase** gratuit (ou utilisation immédiate avec données de démonstration intégrées)

### 1. Cloner le dépôt
```bash
git clone https://github.com/ivanfocsa/devboard.git
cd devboard
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement (Optionnel)
Le projet fonctionne **immédiatement dès le clone** grâce à un système de fallback sur mock-data réaliste. Pour connecter votre propre instance Supabase :

Créez un fichier `.env.local` à la racine :
```bash
cp .env.example .env.local
```

Renseignez vos clés Supabase (disponibles dans le dashboard Supabase > Project Settings > API) :
```ini
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Exécutez le script SQL `supabase/schema.sql` puis `supabase/seed.sql` dans l'éditeur SQL de votre dashboard Supabase.

### 4. Lancer en mode développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 5. Compiler pour la production
```bash
npm run build
```
La compilation génère et affiche clairement la matrice des 5 stratégies de rendu (`○`, `●`, `ƒ`).

---

## 📂 Structure du Projet

```text
devboard/
├── app/
│   ├── layout.js              # Layout global (Navbar, Footer, SEO)
│   ├── globals.css            # Tailwind CSS 4 & design system
│   ├── page.js                # Accueil (ISR 60s, Météo Paris, Articles récents)
│   ├── not-found.js           # Page 404 sur-mesure
│   ├── about/page.js          # À propos (SSG pur)
│   ├── articles/
│   │   ├── page.js            # Liste, recherche & filtres (SSR dynamique)
│   │   ├── loading.js         # Squelettes de chargement
│   │   ├── new/page.js        # Création d'article (CSR protégé)
│   │   └── [id]/
│   │       ├── page.js        # Détail article (SSG dynamique via generateStaticParams)
│   │       └── edit/page.js   # Édition article (CSR propriétaire)
│   ├── profile/page.js        # Profil utilisateur & ses articles (SSR cookies)
│   ├── contact/page.js        # Formulaire de contact (CSR)
│   ├── login/page.js          # Authentification Email & GitHub OAuth (CSR)
│   └── auth/callback/route.js # Échange de code OAuth Supabase
├── components/
│   ├── Navbar.js              # En-tête responsive, météo & menu hamburger
│   ├── Footer.js              # Pied de page informatif
│   ├── ArticleCard.js         # Carte article avec badge & statistiques
│   ├── ArticleSkeleton.js     # Squelette animé de chargement
│   ├── LikeButton.js          # Bouton Like optimiste (Client Component)
│   ├── CommentSection.js      # Espace commentaires interactif (Client Component)
│   ├── DeleteArticleButton.js # Bouton de suppression avec modale
│   └── WeatherWidget.js       # Widget météo en direct Open-Meteo
├── lib/
│   ├── supabase/
│   │   ├── client.js          # Client Supabase navigateur (@supabase/ssr)
│   │   └── server.js          # Client Supabase serveur avec cookies
│   ├── articles.js            # Couche d'accès aux données (Articles, Likes, Commentaires)
│   ├── mock-data.js           # Données de démonstration & fallback build
│   └── weather.js             # Client API météo Open-Meteo Paris
├── middleware.js              # Middleware de rafraîchissement de session et protection
├── supabase/
│   ├── schema.sql             # Définition des 4 tables et des politiques RLS
│   ├── seed.sql               # Données de test initiales
│   └── tests/rls_test.sql     # Script de vérification des règles de sécurité
└── docs/
    ├── ARCHITECTURE.md        # Architecture détaillée & diagramme des composants
    ├── RENDERING.md           # Guide complet des 5 stratégies de rendu
    └── AUTH.md                # Flux OAuth 2.0 et cartographie des acteurs
```

---

## 🛡️ Sécurité & Row Level Security (RLS)

Toutes les tables PostgreSQL (`articles`, `comments`, `likes`, `contacts`) disposent de **Row Level Security activée** :
- **Articles** : Lecture publique pour tous (`using (true)`) ; insertion pour les membres authentifiés (`auth.uid() = user_id`) ; mise à jour et suppression limitées exclusivement au propriétaire de l'article (`using (auth.uid() = user_id)`).
- **Commentaires** : Lecture publique ; création connectée ; suppression réservée à l'auteur du commentaire.
- **Likes** : Lecture publique ; bascule like/unlike protégée par contrainte d'unicité `(article_id, user_id)`.
- **Contacts** : Soumission publique par quiconque ; lecture restreinte au rôle administrateur / authentifié.

---

## 📜 Documentation Complémentaire pour la Soutenance

- [`PROJECT.md`](./PROJECT.md) : **Grille d'auto-évaluation officielle du cours remplie par les 3 étudiants**.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) : Découpage Server vs Client Components et arborescence.
- [`docs/RENDERING.md`](./docs/RENDERING.md) : Tableau comparatif des 5 méthodes de rendu avec logs de build.
- [`docs/AUTH.md`](./docs/AUTH.md) : Schéma d'authentification OAuth 2.0 GitHub & gestion des sessions.
