# Project Name: DevBoard

- **Team Members:**
  - Yvan FOCSA (Lead / Architecture / Auth / Déploiement)
  - Kardiatou TOURE (Backend / Supabase / CRUD Articles)
  - Emir Ben Hassen (Frontend / Tailwind / Social & API)
- **Deployed URL:** [https://devboard-ece.vercel.app](https://devboard-ece.vercel.app)

---

## 1. Concept & User Experience

### Key Features (UI/UX)

DevBoard est une plateforme moderne d'échange et de veille technologique dédiée aux développeurs. L'application met l'accent sur la lisibilité du code, la réactivité des interactions et une expérience utilisateur soignée :
1. **Accueil immersif** avec météo en temps réel de Paris (Open-Meteo) et articles récents.
2. **Recherche en temps réel** et filtrage par catégorie (Frontend, Backend, DevOps, Architecture, Sécurité).
3. **Lecteur d'article typographié** avec coloration du code, temps de lecture et badges de catégories.
4. **Interactivité sociale** : système de Like avec mise à jour optimiste et fil de commentaires interactif.
5. **Espace de rédaction** avec prévisualisation en direct et interface d'édition/suppression pour l'auteur.
6. **Interface 100% responsive** pensée mobile-first avec menu de navigation rétractable (hamburger).

---

## 2. Full-Stack Functionality

*Briefly describe how you implemented the core requirements. Keep it concise (1-2 sentences per item).*

### Authentication

- [x] Sign-up implemented
- [x] Sign-in implemented
- [x] Sign-out implemented
- [x] The UI updates based on user state

**Notes**: Implémentation d'une double stratégie d'authentification : OAuth 2.0 avec GitHub (bouton "Continuer avec GitHub") et Email/Mot de passe natif avec Supabase Auth. Les sessions sont gérées par cookies HTTP sécurisés via `@supabase/ssr` et rafraîchies par `middleware.js`.

**Self-Evaluation:**: 10/10 - Deux flux d'authentification fonctionnels, synchronisation instantanée du header (avatar, bouton déconnexion) et redirection dynamique avec paramètre `?next=`.

### CRUD Operations

- **Main Resource:** Articles techniques (`articles`)
- [x] Create
- [x] Read
- [x] Update
- [x] Delete

**Notes**: Création via `/articles/new`, lecture optimisée via `/articles` (liste) et `/articles/[id]` (détail), modification sur `/articles/[id]/edit` réservée à l'auteur, et suppression sécurisée avec cascade sur les commentaires et likes.

**Self-Evaluation:**: 10/10 - Le cycle CRUD est 100% fonctionnel, avec validation côté client et sécurité matérielle garantie par les politiques RLS PostgreSQL.

### Data Relationships

- **Tables Involved:** `articles` (Parent), `comments` (Child), `likes` (Child), `auth.users` (Parent)
- [x] Relationship implemented

**Notes**: Clés étrangères avec `on delete cascade` liant les articles à leurs commentaires et likes, ainsi qu'aux utilisateurs de Supabase Auth. Contrainte d'unicité composite sur `(article_id, user_id)` pour interdire les doublons de like.

**Self-Evaluation:**: 10/10 - Modèle relationnel PostgreSQL propre avec jointures directes et intégrité référentielle stricte.

### Search & Filtering

- [x] Search implemented
- [x] Filter implemented, available options: `Toutes`, `Frontend`, `Backend`, `DevOps`, `Architecture`, `Sécurité`

**Notes**: Moteur de recherche et de filtrage dynamique exécuté côté serveur via les `searchParams` sur `/articles`, garantissant un premier affichage rapide et une URL partageable (`/articles?category=Frontend&q=Next`).

**Self-Evaluation:**: 10/10 - Filtres et barre de recherche combinables sans rechargement lourd de page.

### External API Integration

- **API Used:** Open-Meteo Public Forecast API (`https://api.open-meteo.com/v1/forecast`)
- **Data fetched:** Météo en direct de Paris (température actuelle, humidité, vitesse du vent, condition météo traduite en français).

**Notes**: Intégrée dans le bandeau d'accueil et le header pour apporter une touche vivante à l'application. Aucun token propriétaire requis, haute disponibilité, et mécanisme de secours en cas d'indisponibilité réseau.

**Self-Evaluation:**: 10/10 - Données fraîches intégrées dans le cycle ISR (revalidation toutes les 60 secondes).

---

## 3. Engineering & Architecture

### Database Schema

*Tables and relationships implemented in Supabase PostgreSQL:*

```text
auth.users (Supabase Managed)
    │
    ├── (1:N) ──> public.articles
    │                 │
    │                 ├── (1:N) ──> public.comments
    │                 │                 └── (N:1) ──> auth.users
    │                 │
    │                 └── (1:N) ──> public.likes [unique(article_id, user_id)]
    │                                   └── (N:1) ──> auth.users
    │
public.contacts (Indépendante : formulaires de contact des visiteurs)
```

**Notes**: Les 4 tables (`articles`, `comments`, `likes`, `contacts`) sont créées dans `supabase/schema.sql` avec leurs index d'optimisation sur les dates et catégories.

**Self-Evaluation:**: 10/10 - Schéma clair, relationnel pur sans sur-couche ORM opaque.

### Row Level Security (RLS)

*Active policies defined in PostgreSQL:*

1. **`articles`** :
   - `SELECT` : Public (`true`)
   - `INSERT` : Utilisateur authentifié (`auth.uid() = user_id`)
   - `UPDATE` : Propriétaire uniquement (`auth.uid() = user_id`)
   - `DELETE` : Propriétaire uniquement (`auth.uid() = user_id`)
2. **`comments`** :
   - `SELECT` : Public (`true`)
   - `INSERT` : Utilisateur authentifié (`auth.uid() = user_id`)
   - `DELETE` : Propriétaire uniquement (`auth.uid() = user_id`)
3. **`likes`** :
   - `SELECT` : Public (`true`)
   - `INSERT` : Utilisateur authentifié (`auth.uid() = user_id`)
   - `DELETE` : Propriétaire uniquement (`auth.uid() = user_id`)
4. **`contacts`** :
   - `INSERT` : Tout visiteur (`true`)
   - `SELECT` : Utilisateur connecté / Admin (`auth.role() = 'authenticated'`)

**Notes**: Les scripts de validation `supabase/tests/rls_test.sql` attestent que les accès illégitimes (mise à jour d'un article par un tiers) sont formellement rejetés par le moteur SQL.

**Self-Evaluation:**: 10/10 - RLS complète et testée sur les 4 tables.

### Server vs. Client Components

*Identification of significant Server and Client Components:*

**Server Component:** `app/articles/page.js` (Liste et recherche des articles)
- *Why?* Traite directement les requêtes de recherche et filtre la base de données côté serveur sans exposer la logique SQL au navigateur. Réduit drastiquement la taille du bundle JavaScript envoyé au client et optimise le référencement naturel (SEO).

**Client Component:** `components/LikeButton.js` (Bouton d'interaction Like)
- *Why?* Nécessite des hooks React (`useState`, gestionnaires d'événements `onClick`), gère un état d'optimistic update pour une sensation d'immédiateté au clic, et vérifie la session utilisateur pour afficher un message interactif si l'utilisateur est anonyme.

---

## 4. Self-Reflection & Feedback

*This section is completed individually by each team member.*

### Proudest Achievement

*What is the technically most difficult or most polished feature you built?*

- **Yvan FOCSA** : "La mise en place de l'architecture d'authentification hybride (GitHub OAuth 2.0 et Email) couplée au middleware Next.js 15. Gérer les flux de redirection avec conservation de la destination via `?next=`, assurer la synchronisation des cookies de session entre Server et Client Components via `@supabase/ssr`, et faire cohabiter les 5 modes de rendu (SSG, SSR, ISR, CSR) sans aucune régression au build."

- **Kardiatou TOURE** : "La conception du modèle de données PostgreSQL et le verrouillage strict de la sécurité par Row Level Security (RLS). C'était très enrichissant d'écrire des politiques SQL qui garantissent mathématiquement qu'aucun utilisateur ne peut modifier l'article d'un autre, même s'il contournait l'interface React en appelant directement l'API Supabase."

- **Emir Ben Hassen** : "L'intégration du design system complet avec Tailwind CSS 4 et l'optimistic UI sur les interactions sociales (bouton Like et commentaires). L'absence de configuration `tailwind.config.js` dans Tailwind 4 était un défi au début, mais le résultat offre un rendu sombre très élégant, parfaitement fluide sur mobile avec le menu hamburger et le widget météo Open-Meteo."

### What Would You Improve?

*If you had more time, what would you add or improve in your project?*

- **Yvan FOCSA** : "J'ajouterais la prise en charge de Supabase Realtime avec des WebSockets pour mettre à jour instantanément le compteur de likes et les nouveaux commentaires sans avoir besoin de rafraîchir la page."

- **Kardiatou TOURE** : "L'intégration d'un éditeur Markdown complet (type TipTap ou MDX) avec upload d'images directement hébergées dans un bucket Supabase Storage, ainsi qu'une recherche plein texte PostgreSQL avec `to_tsvector`."

- **Emir Ben Hassen** : "Un switch de thème sombre/clair persistant en local storage, ainsi que des graphiques interactifs des tendances de lecture pour le tableau de bord utilisateur."

### Course Feedback (Bonus)

*What did you enjoy about this course? What could be improved for next year?*

- **Yvan FOCSA** : "Le cours ECE WebTech est l'un des plus concrets et formateurs du cursus. Travailler sur des technologies professionnelles actuelles (Next.js 15 App Router, Supabase, Vercel) nous prépare réellement aux exigences du monde du travail. Pour l'an prochain, un lab dédié à la mise en place de tests end-to-end avec Playwright serait un ajout formidable !"

- **Kardiatou TOURE** : "J'ai particulièrement apprécié l'accent mis sur la sécurité avec Supabase et RLS. La distinction entre Server Components et Client Components est désormais limpide. Une suggestion pour l'année prochaine : aborder brièvement les Server Actions avancées avec validation Zod."

- **Emir Ben Hassen** : "Les labs progressifs et la liberté sur le sujet du projet final sont d'excellents points forts. On apprend en construisant un vrai produit. Merci à l'équipe pédagogique d'Adaltas pour la qualité des supports et leur réactivité pendant les séances de TP !"
