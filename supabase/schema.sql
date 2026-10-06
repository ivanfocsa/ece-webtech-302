-- ==============================================================================
-- DevBoard - Schéma PostgreSQL initial (ECE WebTech 2026 Fall)
-- Auteurs : Yvan FOCSA, Emir Ben Hassen, Kardiatou TOURE
-- ==============================================================================

create extension if not exists "pgcrypto";

-- 1. Table des Articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Web',
  summary text not null,
  content text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table des Commentaires
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table des Likes
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_article_user_like unique (article_id, user_id)
);

-- 4. Table des Contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
