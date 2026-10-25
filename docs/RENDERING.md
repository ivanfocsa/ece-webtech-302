# Les 5 Stratégies de Rendu dans DevBoard

L'application DevBoard implémente et met en valeur les **5 méthodes de rendu offertes par Next.js 15 (App Router)**. Ce guide explique la mise en œuvre de chacune et fournit les éléments de preuve observés lors de la compilation (`npm run build`).

---

## 1. Tableau Synthétique des 5 Méthodes

| # | Stratégie | Route | Symbole Build | Mécanisme Next.js 15 | Cas d'Usage Réel |
|---|---|---|---|---|---|
| **1** | **SSG** (Statique) | `/about` | `○ (Static)` | Pré-rendu complet au build (aucun paramètre dynamique) | Page de présentation, mission, informations fixes |
| **2** | **SSG Dynamique** | `/articles/[id]` | `● (SSG)` | `generateStaticParams()` pré-rend les fiches d'articles | Pages de contenu indexables au SEO optimal |
| **3** | **SSR** (Serveur dynamique) | `/articles`<br>`/profile` | `ƒ (Dynamic)` | Accès à `searchParams` ou aux `cookies()` de requête | Recherche filtrée en direct, espace personnel privé |
| **4** | **ISR** (Régénération incrémentale) | `/` | `○ / ● (ISR: 60s)` | `export const revalidate = 60;` | Accueil avec météo en direct et derniers articles |
| **5** | **CSR** (Rendu Client) | `/contact`<br>`/login`<br>`/articles/new` | `○ (Client Shell)` + Hydratation | Directive `"use client"`, React State, DOM events | Formulaires interactifs, boutons de Like, commentaires |

---

## 2. Analyse Détaillée par Stratégie

### 1. SSG (Static Site Generation) - Route `/about`
- **Fichier** : `app/about/page.js`
- **Principe** : La page ne fait appel à aucune fonction dynamique (`cookies`, `headers`, `searchParams`). Next.js compile un fichier HTML pur au moment du `npm run build`.
- **Avantage** : Temps de réponse quasi instantané (servi directement depuis le CDN Vercel Edge Cache) et zéro coût serveur.

### 2. SSG Dynamique avec Paramètres - Route `/articles/[id]`
- **Fichier** : `app/articles/[id]/page.js`
- **Implémentation** :
  ```javascript
  export async function generateStaticParams() {
    const ids = await getStaticArticleIds();
    return ids.map((id) => ({ id: String(id) }));
  }
  ```
- **Principe** : Next.js exécute `generateStaticParams()` lors de la compilation pour découvrir tous les identifiants d'articles existants et générer leurs pages HTML statiques. Si un nouvel article est ajouté ultérieurement, Next.js le rend à la demande avec mise en cache progressive.

### 3. SSR (Server-Side Rendering) - Routes `/articles` et `/profile`
- **Fichiers** : `app/articles/page.js` et `app/profile/page.js`
- **Implémentation `/articles`** :
  ```javascript
  export default async function ArticlesPage({ searchParams }) {
    const { q, category } = (await searchParams) || {};
    const articles = await getArticles({ query: q, category });
    // ...
  }
  ```
- **Implémentation `/profile`** :
  ```javascript
  import { createClient } from '@/lib/supabase/server';
  export default async function ProfilePage() {
    const supabase = await createClient(); // lit les cookies HTTP
    const { data: { user } } = await supabase.auth.getUser();
    // ...
  }
  ```
- **Principe** : La présence de `searchParams` ou la lecture de cookies force Next.js à basculer la route en mode dynamique (`ƒ Dynamic`). Le serveur régénère le HTML à chaque requête pour refléter exactement les filtres ou l'identité du visiteur.

### 4. ISR (Incremental Static Regeneration) - Route `/`
- **Fichier** : `app/page.js`
- **Implémentation** :
  ```javascript
  export const revalidate = 60; // Revalidation toutes les 60 secondes
  ```
- **Principe** : L'accueil est généré statiquement au build. Pendant 60 secondes, tous les visiteurs reçoivent la version en cache ultra-rapide. À l'expiration du délai, la première requête entrante déclenche une régénération silencieuse en arrière-plan pour actualiser la météo Open-Meteo et les nouveaux articles.

### 5. CSR (Client-Side Rendering) - Composants Interactifs & Formulaires
- **Fichiers** : `app/contact/page.js`, `app/login/page.js`, `components/LikeButton.js`, `components/CommentSection.js`
- **Principe** : Démarqués par la directive `"use client"`. Le serveur envoie un squelette HTML minimal, et le code JavaScript s'exécute dans le navigateur pour gérer les inputs, l'optimistic update, et les validations instantanées.

---

## 3. Sortie Officielle de `npm run build`

```text
Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                      136 B         103 kB          1m      1y
├ ○ /_not-found                            998 B         104 kB
├ ○ /about                                 136 B         103 kB
├ ƒ /articles                              136 B         103 kB
├ ● /articles/[id]                         136 B         103 kB
├   ├ /articles/a1111111-1111-1111-1111-111111111111
├   ├ /articles/a2222222-2222-2222-2222-222222222222
├   └ /articles/a3333333-3333-3333-3333-333333333333
├ ○ /articles/new                          278 B         103 kB
├ ○ /contact                               281 B         103 kB
├ ○ /login                                 281 B         103 kB
└ ƒ /profile                               136 B         103 kB

○  (Static)   prerendered as static content (SSG)
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand (SSR)
```
