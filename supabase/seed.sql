-- DevBoard initial seed data (articles de base)
insert into public.articles (id, title, slug, category, summary, content, user_id, author_name)
values
  ('a1111111-1111-1111-1111-111111111111', 'Comprendre Next.js 15 et le nouveau cache', 'comprendre-nextjs-15-nouveau-cache', 'Frontend', 'Analyse du cache par défaut dans Next.js 15.', 'Contenu initial...', '00000000-0000-0000-0000-000000000001', 'Yvan FOCSA'),
  ('a2222222-2222-2222-2222-222222222222', 'Supabase vs Firebase', 'supabase-vs-firebase-guide-postgresql', 'Backend', 'Comparatif PostgreSQL vs NoSQL.', 'Contenu initial...', '00000000-0000-0000-0000-000000000002', 'Emir Ben Hassen');
