import { createBrowserClient } from '@supabase/ssr';

function sanitizeUrl(rawUrl) {
  if (!rawUrl) return 'https://placeholder.supabase.co';
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

/**
 * Client Supabase pour le navigateur (Client Components).
 * Gère l'authentification et les requêtes réactives côté client.
 */
export function createClient() {
  const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key').trim();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
