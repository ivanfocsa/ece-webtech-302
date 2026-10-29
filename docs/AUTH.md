# Guide d'Authentification & Flux OAuth 2.0

Ce document détaille l'implémentation de la sécurité et de l'authentification au sein de DevBoard en utilisant **Supabase Auth**, **GitHub OAuth 2.0** et le **Middleware Next.js 15**.

---

## 1. Cartographie des Acteurs OAuth 2.0

Dans l'architecture DevBoard, les 4 rôles fondamentaux de la spécification RFC 6749 s'articulent ainsi :

| Rôle OAuth 2.0 | Entité dans DevBoard | Rôle concret |
|---|---|---|
| **Resource Owner** | L'Étudiant / Utilisateur | Possède son compte GitHub et autorise DevBoard à accéder à son profil public. |
| **Client** | DevBoard (Application Next.js) | Demande l'autorisation d'accéder aux informations d'identité de l'utilisateur. |
| **Authorization Server** | GitHub (`github.com/login/oauth`) | Authentifie l'utilisateur, demande son consentement et délivre le code d'autorisation. |
| **Resource Server** | GitHub API & Supabase PostgreSQL | Valide le jeton d'accès et stocke l'identité dans `auth.users`. |

---

## 2. Diagramme de Séquence du Flux OAuth 2.0 GitHub

```text
[Utilisateur]        [DevBoard Client]       [GitHub OAuth]       [DevBoard Callback]     [Supabase Auth]
     │                      │                       │                      │                     │
     ├─ Clic "Continuer" ──>│                       │                      │                     │
     │                      ├─ signInWithOAuth() ──>│                      │                     │
     │                      │  (scope: read:user)   │                      │                     │
     │<────── Redirection vers GitHub ──────────────┤                      │                     │
     │                      │                       │                      │                     │
     ├─ Validation Login ──>│                       │                      │                     │
     │  & Consentement      │                       │                      │                     │
     │                      │                       ├─ Redirection GET ───>│                     │
     │                      │                       │  code=AUTH_CODE      │                     │
     │                      │                       │                      ├─ exchangeCode() ───>│
     │                      │                       │                      │<── Session JWT ─────┤
     │                      │                       │                      │    (Cookies HTTP)   │
     │<─────────────────────┴── Redirection vers /profile ou destination ──┤                     │
```

---

## 3. Sécurisation des Routes par `middleware.js`

Le middleware Next.js intercepte chaque requête avant qu'elle n'atteigne le routeur de page :

1. **Extraction de session** : Lit les cookies chiffrés via le client serveur `@supabase/ssr`.
2. **Rafraîchissement transparent** : Si le token JWT approche de son expiration, Supabase le renouvelle automatiquement.
3. **Contrôle d'accès** : Si l'URL demandée figure parmi les routes protégées (`/profile`, `/articles/new`, `/articles/:id/edit`) et qu'aucun utilisateur n'est authentifié, une redirection `307` est renvoyée vers `/login?next=<destination>`.
4. **Écran d'accueil** : Un visiteur non connecté qui arrive sur `/` est redirigé vers `/login`. Le bouton "Continuer sans compte" pose un cookie `devboard_guest` qui désactive cette redirection. La page `/` reste en ISR car la redirection se fait dans le middleware, avant le cache.
5. **Post-connexion** : Après validation réussie, l'utilisateur est automatiquement redirigé vers sa page d'origine grâce au paramètre `next`.

---

## 4. Double Flux : Email / Mot de Passe

Pour les utilisateurs ne disposant pas de compte GitHub, DevBoard intègre un formulaire natif avec validation :
- **Inscription** (`handleEmail`) : Création de compte via `supabase.auth.signUp()` avec le début de l'email comme nom affiché.
- **Connexion** (`handleEmail`) : Authentification via `supabase.auth.signInWithPassword()` avec affichage immédiat des messages d'erreur éventuels (identifiants invalides, mot de passe trop court).
- **Déconnexion** : Révocation du token et nettoyage complet des cookies HTTP via `supabase.auth.signOut()`.
