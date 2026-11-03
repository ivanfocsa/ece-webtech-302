-- Exécuter dans le SQL Editor Supabase après le schéma, avec deux comptes existants.
-- Toutes les données créées par ce test sont annulées à la fin.
begin;
create temporary table rls_context as
select (select id from auth.users order by id limit 1) as owner_id,
       (select id from auth.users order by id offset 1 limit 1) as other_id,
       gen_random_uuid() as article_id;
do $$ begin
  if exists (select 1 from rls_context where owner_id is null or other_id is null) then
    raise exception 'Créez deux comptes de test avant de lancer ce script.';
  end if;
end $$;
grant select on rls_context to anon, authenticated;

set local role anon;
do $$ begin
  begin
    insert into public.articles(title,slug,summary,content,user_id,author_name)
    select 'RLS anonymous', 'rls-anon-' || article_id, 'test', 'test', owner_id, 'test' from rls_context;
    raise exception 'FAIL : insertion anonyme autorisée';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

select set_config('request.jwt.claims', json_build_object('sub', owner_id, 'role', 'authenticated')::text, true) from rls_context;
set local role authenticated;
insert into public.articles(id,title,slug,summary,content,user_id,author_name)
select article_id, 'RLS owner', 'rls-' || article_id, 'test', 'test', owner_id, 'Owner' from rls_context;
do $$ declare n integer; begin
  update public.articles set title='RLS owner updated' where id=(select article_id from rls_context);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FAIL : modification par auteur bloquée'; end if;
end $$;
reset role;

select set_config('request.jwt.claims', json_build_object('sub', other_id, 'role', 'authenticated')::text, true) from rls_context;
set local role authenticated;
do $$ declare n integer; begin
  update public.articles set title='Unauthorized' where id=(select article_id from rls_context);
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL : modification par tiers autorisée'; end if;
  delete from public.articles where id=(select article_id from rls_context);
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL : suppression par tiers autorisée'; end if;
end $$;
insert into public.comments(article_id,user_id,author_name,content)
select article_id,other_id,'Other','RLS test' from rls_context;
insert into public.likes(article_id,user_id) select article_id,other_id from rls_context;
do $$ begin
  begin
    insert into public.likes(article_id,user_id) select article_id,other_id from rls_context;
    raise exception 'FAIL : doublon de like autorisé';
  exception when unique_violation then null;
  end;
  begin
    insert into public.comments(article_id,user_id,author_name,content)
    select article_id,owner_id,'Forged','RLS test' from rls_context;
    raise exception 'FAIL : usurpation auteur autorisée';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- Contact public, lecture interdite aux visiteurs et comptes ordinaires.
set local role anon;
insert into public.contacts(name,email,subject,message)
select 'RLS test','rls@example.invalid',article_id::text,'Private test' from rls_context;
do $$ begin
  if exists(select 1 from public.contacts where subject=(select article_id::text from rls_context)) then
    raise exception 'FAIL : contact visible anonymement';
  end if;
end $$;
reset role;
set local role authenticated;
do $$ begin
  if exists(select 1 from public.contacts where subject=(select article_id::text from rls_context)) then
    raise exception 'FAIL : contact visible par compte ordinaire';
  end if;
end $$;
reset role;
select set_config('request.jwt.claims', json_build_object('sub', owner_id, 'role', 'authenticated', 'app_metadata', json_build_object('role','admin'))::text, true) from rls_context;
set local role authenticated;
do $$ begin
  if not exists(select 1 from public.contacts where subject=(select article_id::text from rls_context)) then
    raise exception 'FAIL : contact inaccessible administrateur';
  end if;
end $$;
reset role;
select set_config('request.jwt.claims', json_build_object('sub', owner_id, 'role', 'authenticated')::text, true) from rls_context;
set local role authenticated;
do $$ declare n integer; begin
  delete from public.articles where id=(select article_id from rls_context);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FAIL : suppression par auteur bloquée'; end if;
end $$;
reset role;
do $$ begin
  if exists(select 1 from public.comments where article_id=(select article_id from rls_context))
    or exists(select 1 from public.likes where article_id=(select article_id from rls_context)) then
    raise exception 'FAIL : cascade incomplète';
  end if;
end $$;
rollback;
select 'PASS : permissions, likes uniques, contacts privés et cascade' as result;
