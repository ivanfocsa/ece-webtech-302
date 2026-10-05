import { createBrowserClient } from '@supabase/ssr';

/**
 * Client Supabase pour le navigateur (Client Components).
 * Gère l'authentification et les requêtes réactives côté client.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
