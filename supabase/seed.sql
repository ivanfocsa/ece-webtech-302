-- ==============================================================================
-- DevBoard - Articles d'exemple
-- À lancer une fois dans Supabase (SQL Editor), après schema.sql.
-- Les articles sont rattachés au premier compte créé (celui de Yvan),
-- car user_id doit exister dans auth.users. author_name sert juste à l'affichage.
-- ==============================================================================

with owner as (
  select id from auth.users order by created_at limit 1
)
insert into public.articles (title, slug, category, summary, content, user_id, author_name, created_at)
select a.title, a.slug, a.category, a.summary, a.content, owner.id, a.author_name, now() - a.age
from owner, (values
  (
    'Les modes de rendu de Next.js en bref',
    'modes-de-rendu-nextjs',
    'Frontend',
    'SSG, ISR, SSR et CSR : ce que fait chacun et quand l''utiliser.',
    'SSG génère la page une fois au build. ISR fait pareil mais régénère la page après un délai, par exemple 60 secondes. SSR construit la page à chaque requête, utile quand le contenu dépend de l''utilisateur. CSR laisse le navigateur faire le rendu, pratique pour les formulaires et les boutons interactifs.

Sur DevBoard, chaque page affiche un badge avec son mode de rendu.',
    'Yvan FOCSA',
    interval '12 days'
  ),
  (
    'Protéger des routes avec le middleware',
    'proteger-routes-middleware',
    'Sécurité',
    'Comment le middleware vérifie la session avant d''afficher une page privée.',
    'Le middleware tourne avant chaque requête. Il lit la session Supabase dans les cookies. Si la page demandée est privée (/profile, /articles/new) et que personne n''est connecté, il redirige vers /login.

Avantage : la vérification est faite côté serveur, la page privée n''est jamais envoyée au navigateur.',
    'Yvan FOCSA',
    interval '9 days'
  ),
  (
    'Row Level Security sur Supabase',
    'row-level-security-supabase',
    'Backend',
    'Laisser PostgreSQL décider qui peut lire ou modifier une ligne.',
    'Avec RLS, chaque table a des règles. Sur DevBoard, tout le monde peut lire les articles, mais seul l''auteur peut les modifier ou les supprimer. La règle compare auth.uid() avec la colonne user_id.

Même si quelqu''un appelle l''API directement, la base refuse la requête.',
    'Kardiatou TOURE',
    interval '7 days'
  ),
  (
    'Modéliser articles, likes et commentaires',
    'modeliser-articles-likes-commentaires',
    'Architecture',
    'Quatre tables simples et des clés étrangères bien posées.',
    'Les tables comments et likes pointent vers articles avec on delete cascade : supprimer un article supprime aussi ses likes et commentaires. Une contrainte unique sur (article_id, user_id) empêche de liker deux fois le même article.',
    'Kardiatou TOURE',
    interval '5 days'
  ),
  (
    'Tailwind CSS 4 sans fichier de config',
    'tailwind-css-4-sans-config',
    'Frontend',
    'Tout se fait dans le CSS avec @import et @apply.',
    'Avec Tailwind 4, plus besoin de tailwind.config.js. On importe Tailwind dans globals.css et on définit quelques classes communes (boutons, champs, cartes) avec @apply. Le reste se fait directement dans les composants.',
    'Emir Ben Hassen',
    interval '3 days'
  ),
  (
    'Appeler une API externe avec ISR',
    'api-externe-isr-open-meteo',
    'DevOps',
    'Le widget météo de l''accueil utilise Open-Meteo, sans clé d''API.',
    'La météo de Paris est récupérée côté serveur avec fetch et next: { revalidate: 300 }. La réponse est mise en cache, donc l''API n''est appelée qu''une fois toutes les 5 minutes, même avec beaucoup de visiteurs.',
    'Emir Ben Hassen',
    interval '1 day'
  )
) as a(title, slug, category, summary, content, author_name, age)
on conflict (slug) do nothing;
