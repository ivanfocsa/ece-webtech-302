import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function sanitizeUrl(rawUrl) {
  if (!rawUrl) return 'https://placeholder.supabase.co';
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

/**
 * Client Supabase pour les Server Components et Route Handlers.
 * Lit et écrit les cookies de session utilisateur de manière sécurisée.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key').trim();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Appel depuis un Server Component : l'écriture de cookie est déléguée au middleware.
        }
      },
    },
  });
}
