import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeRedirectPath } from '@/lib/safe-redirect';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const next = safeRedirectPath(requestUrl.searchParams.get('next'));
  const failure = new URL('/login', requestUrl.origin);
  failure.searchParams.set('error', 'auth_callback');
  failure.searchParams.set('next', next);
  const code = requestUrl.searchParams.get('code');
  if (!code || requestUrl.searchParams.has('error')) return NextResponse.redirect(failure);
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(failure);
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch {
    return NextResponse.redirect(failure);
  }
}
