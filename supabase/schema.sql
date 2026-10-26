-- ==============================================================================
-- DevBoard - Schéma PostgreSQL complet avec Row Level Security (RLS)
-- ECE WebTech 2026 Fall
-- ==============================================================================

create extension if not exists "pgcrypto";

-- 1. Table: articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Frontend',
  summary text not null,
  content text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table: comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table: likes
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_article_user_like unique (article_id, user_id)
);

-- 4. Table: contacts (messages du formulaire de contact)
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes pour optimiser les requêtes
create index if not exists idx_articles_created_at on public.articles(created_at desc);
create index if not exists idx_articles_category on public.articles(category);
create index if not exists idx_comments_article on public.comments(article_id);
create index if not exists idx_likes_article on public.likes(article_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Activation RLS sur toutes les tables
alter table public.articles enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.contacts enable row level security;

-- Policies: articles
drop policy if exists "Tout le monde peut lire les articles" on public.articles;
create policy "Tout le monde peut lire les articles"
  on public.articles for select
  using (true);

drop policy if exists "Les utilisateurs connectés peuvent créer des articles" on public.articles;
create policy "Les utilisateurs connectés peuvent créer des articles"
  on public.articles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Seul l'auteur peut modifier son article" on public.articles;
create policy "Seul l'auteur peut modifier son article"
  on public.articles for update
  using (auth.uid() = user_id);

drop policy if exists "Seul l'auteur peut supprimer son article" on public.articles;
create policy "Seul l'auteur peut supprimer son article"
  on public.articles for delete
  using (auth.uid() = user_id);

-- Policies: comments
drop policy if exists "Tout le monde peut lire les commentaires" on public.comments;
create policy "Tout le monde peut lire les commentaires"
  on public.comments for select
  using (true);

drop policy if exists "Les utilisateurs connectés peuvent commenter" on public.comments;
create policy "Les utilisateurs connectés peuvent commenter"
  on public.comments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Seul l'auteur peut supprimer son commentaire" on public.comments;
create policy "Seul l'auteur peut supprimer son commentaire"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Policies: likes
drop policy if exists "Tout le monde peut voir les likes" on public.likes;
create policy "Tout le monde peut voir les likes"
  on public.likes for select
  using (true);

drop policy if exists "Les utilisateurs connectés peuvent liker" on public.likes;
create policy "Les utilisateurs connectés peuvent liker"
  on public.likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Un utilisateur peut retirer son propre like" on public.likes;
create policy "Un utilisateur peut retirer son propre like"
  on public.likes for delete
  using (auth.uid() = user_id);

-- Policies: contacts
drop policy if exists "N'importe qui peut envoyer un message de contact" on public.contacts;
create policy "N'importe qui peut envoyer un message de contact"
  on public.contacts for insert
  with check (true);

drop policy if exists "Seuls les utilisateurs authentifiés peuvent lire les contacts" on public.contacts;
create policy "Seuls les utilisateurs authentifiés peuvent lire les contacts"
  on public.contacts for select
  using (auth.role() = 'authenticated');

-- Index composite pour optimiser le filtrage par categorie et tri par date
create index if not exists idx_articles_cat_created on public.articles(category, created_at desc);
