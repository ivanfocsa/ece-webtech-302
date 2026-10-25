# Architecture Technique de DevBoard

Ce document détaille l'organisation structurelle, le cycle de vie des requêtes et le découpage entre Server Components et Client Components de l'application DevBoard.

---

## 1. Arborescence Applicative (Next.js 15 App Router)

```text
devboard/
├── app/
│   ├── layout.js              # [Server] Layout racine (HTML, polices, métadonnées, structure)
│   ├── globals.css            # Feuille de styles globale Tailwind CSS 4
│   ├── page.js                # [Server - ISR 60s] Page d'accueil & météo
│   ├── not-found.js           # [Server] Page d'erreur 404 sur-mesure
│   ├── about/
│   │   └── page.js            # [Server - SSG] Présentation de l'équipe et du projet
│   ├── articles/
│   │   ├── page.js            # [Server - SSR] Moteur de recherche et catalogue d'articles
│   │   ├── loading.js         # [Server] Interface de chargement (skeletons)
│   │   ├── new/
│   │   │   └── page.js        # [Client - CSR] Formulaire de rédaction d'article
│   │   └── [id]/
│   │       ├── page.js        # [Server - Dynamic SSG] Détail de l'article avec generateStaticParams
│   │       └── edit/
│   │           └── page.js    # [Client - CSR] Formulaire d'édition propriétaire
│   ├── profile/
│   │   └── page.js            # [Server - SSR] Profil utilisateur et articles publiés
│   ├── contact/
│   │   └── page.js            # [Client - CSR] Formulaire de prise de contact
│   ├── login/
│   │   └── page.js            # [Client - CSR] Interface d'authentification Email & OAuth
│   └── auth/
│       └── callback/
│           └── route.js       # [Route Handler] Échange du code temporaire OAuth GitHub
```

---

## 2. Découpage Server Components vs Client Components

Pour optimiser les performances (Core Web Vitals) et minimiser la charge JavaScript transmise au navigateur, DevBoard applique le principe du **moindre privilège côté client** :

```text
                           ┌────────────────────────┐
                           │   Root Layout (RSC)    │
                           └───────────┬────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────┐                         ┌───────────────────────┐
│     Navbar (Client)       │                         │   Footer (Server)     │
│ - Menu hamburger mobile   │                         │ - Liens & crédits     │
│ - Statut d'authentification│                         └───────────────────────┘
│ - Widget météo Paris      │
└───────────────────────────┘
```

### Server Components (`RSC`)
- **`app/page.js`** : Effectue la requête initiale vers Supabase et l'API Open-Meteo au build/revalidation (ISR).
- **`app/about/page.js`** : 100% statique (SSG). Aucun JavaScript d'interactivité n'est envoyé pour cette page.
- **`app/articles/page.js`** : Traite les paramètres de filtre et de recherche (`searchParams`) côté serveur, génère le HTML prêt à l'emploi et favorise le SEO.
- **`app/articles/[id]/page.js`** : Pré-génère les articles existants au moment de la compilation grâce à `generateStaticParams()`.
- **`app/profile/page.js`** : Lit les cookies de session pour récupérer les données de l'utilisateur connecté sans exposer d'informations sensibles.

### Client Components (`"use client"`)
- **`components/Navbar.js`** : Gère l'ouverture/fermeture du menu responsive et écoute les changements d'état d'authentification (`onAuthStateChange`).
- **`components/LikeButton.js`** : Gère l'état local du clic, l'optimistic UI (incrémentation immédiate) et envoie la requête à Supabase.
- **`components/CommentSection.js`** : Gère la saisie textuelle, l'ajout instantané de commentaire dans la liste et la suppression.
- **`components/DeleteArticleButton.js`** : Gère la fenêtre de confirmation et déclenche la redirection après suppression.
- **`app/contact/page.js`** : Contrôle la saisie des champs en temps réel et affiche les notifications de succès/erreur.
- **`app/login/page.js`** : Alterne entre les onglets "Connexion" et "Inscription", communique avec GitHub OAuth et Supabase Auth.

---

## 3. Flux de Données et Sécurité

```text
[Navigateur Client]
        │
        ├── 1. Requête HTTP
        ▼
[Middleware Next.js] ────────── Valide les cookies / Protège /profile, /new, /edit
        │
        ├── 2. Transmission autorisée
        ▼
[Server Components / Pages] ─── Lit Supabase via @supabase/ssr (Server Client)
        │
        ├── 3. Envoi HTML + RSC Payload
        ▼
[Client Components] ────────── Requêtes interactives ciblées (Likes, Commentaires)
        │
        ▼
[PostgreSQL Supabase (RLS)] ── Applique strictement `auth.uid() = user_id`
```
