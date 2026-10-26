import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

function sanitizeUrl(rawUrl) {
  if (!rawUrl) return '';
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  const isProtectedPath =
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/articles/new') ||
    request.nextUrl.pathname.endsWith('/edit');

  // Si Supabase n'est pas encore configuré en local, autoriser pour la démonstration
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project')) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/articles/new',
    '/articles/:id/edit',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
