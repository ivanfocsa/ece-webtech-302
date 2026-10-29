-- À exécuter dans Supabase pour une base existante. Aucun message n'est supprimé.
-- Seul un environnement de confiance peut attribuer app_metadata.role = admin.
begin;
drop policy if exists "Seuls les utilisateurs authentifiés peuvent lire les contacts" on public.contacts;
drop policy if exists "Seuls les administrateurs peuvent lire les contacts" on public.contacts;
create policy "Seuls les administrateurs peuvent lire les contacts"
  on public.contacts for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
commit;
