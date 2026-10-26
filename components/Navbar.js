'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || key === 'placeholder-anon-key' || key.length < 20) {
      return;
    }

    try {
      const supabase = createClient();

      supabase.auth.getUser()
        .then(({ data: { user } }) => {
          setUser(user ?? null);
        })
        .catch(() => {});

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Pas d'interruption si les clés sont en cours d'initialisation
    }
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/articles', label: 'Articles' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo sobre sans icône superflue */}
          <Link href="/" className="text-base font-bold tracking-tight text-white hover:text-zinc-300 transition-colors">
            DevBoard
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/articles/new"
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
            >
              Écrire un article
            </Link>

            {user ? (
              <div className="flex items-center space-x-3 text-xs">
                <Link
                  href="/profile"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-zinc-200 text-black transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-1.5 rounded"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-black px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-2 py-1.5 text-sm text-zinc-300 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            <Link
              href="/articles/new"
              className="text-center py-1.5 rounded text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-200"
            >
              Écrire un article
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-center py-1.5 rounded text-xs text-zinc-300"
                >
                  Mon compte ({user.email})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-center py-1.5 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-center py-1.5 rounded text-xs font-medium bg-white text-black"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
