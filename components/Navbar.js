'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user)).catch(() => {});
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // L'écran de connexion s'affiche seul, sans navigation
  if (pathname === '/login') return null;

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const linkClass = (href) => (pathname === href ? 'text-white' : 'link');

  const account = user ? (
    <>
      <Link href="/profile" className="link">{user.user_metadata?.full_name || user.email}</Link>
      <button onClick={signOut} className="link">Déconnexion</button>
    </>
  ) : (
    <Link href="/login" className="btn btn-primary py-1.5">Connexion</Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between text-sm">
        <Link href="/" className="font-semibold text-white">DevBoard</Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>{l.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">{account}</div>

        <button onClick={() => setOpen(!open)} className="md:hidden link" aria-label="Menu">
          {open ? 'Fermer' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-zinc-900 px-4 py-3 flex flex-col gap-3 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>{l.label}</Link>
          ))}
          <div className="pt-3 border-t border-zinc-900 flex items-center gap-4">{account}</div>
        </nav>
      )}
    </header>
  );
}
