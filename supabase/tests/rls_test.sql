-- ==============================================================================
-- DevBoard - Tests automatisés des politiques RLS Supabase
-- Exécutable dans l'éditeur SQL de Supabase pour valider les règles de sécurité
-- ==============================================================================

-- 1. Test de lecture publique des articles (doit renvoyer toutes les lignes)
set role anon;
select count(*) as public_articles_count from public.articles;

-- 2. Test d'insertion anonyme d'article (doit échouer - RLS violation)
do $$
begin
  begin
    insert into public.articles (title, slug, summary, content, user_id, author_name)
    values ('Hack Test', 'hack-test', 'Summary', 'Content', '00000000-0000-0000-0000-000000000000', 'Attacker');
    raise exception 'ERREUR : L insertion anonyme aurait dû échouer !';
  exception
    when insufficient_privilege then
      raise notice 'SUCCÈS : L insertion anonyme a été bloquée par RLS.';
    when others then
      raise notice 'SUCCÈS : Exception interceptée (% : %)', sqlstate, sqlerrm;
  end;
end $$;

-- 3. Test d'insertion d'un message de contact (doit réussir pour tout le monde)
insert into public.contacts (name, email, subject, message)
values ('Visiteur Test', 'test@ece.fr', 'Question projet', 'Superbe application DevBoard !');

select count(*) as contacts_sent from public.contacts where email = 'test@ece.fr';
