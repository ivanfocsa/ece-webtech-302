import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

function sanitizeUrl(rawUrl) {
  if (!rawUrl) return '';
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  const configured = supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project');

  let user = null;

  if (configured) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const { pathname } = request.nextUrl;

  // Premier passage sur l'accueil : on propose de se connecter (ou de continuer en visiteur)
  if (pathname === '/' && !user && !request.cookies.get('devboard_guest')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Routes privées : connexion obligatoire (sauf en local sans Supabase, pour la démo)
  const isProtected = pathname.startsWith('/profile') || pathname === '/articles/new' || pathname.endsWith('/edit');

  if (configured && isProtected && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|auth/callback|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
