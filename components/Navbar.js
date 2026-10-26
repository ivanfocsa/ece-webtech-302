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

      // Récupérer la session courante
      supabase.auth.getUser()
        .then(({ data: { user } }) => {
          setUser(user ?? null);
        })
        .catch(() => {});

      // Écouter les changements d'authentification
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Ignorer si les clés ne sont pas encore configurées
    }
  }, []);

  // Fermer le menu mobile lors d'un changement d'URL
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
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
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Minimaliste */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <span className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105">
                ⚡
              </span>
              <span className="text-base font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                DevBoard
              </span>
            </Link>
          </div>

          {/* Navigation Bureau */}
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

          {/* Actions Utilisateur */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/articles/new"
              className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 transition-colors"
            >
              + Écrire
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-xs text-zinc-300 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-md bg-zinc-950 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Bouton Hamburger Mobile */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-2 rounded-md"
              aria-label="Ouvrir le menu"
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

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-black px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            <Link
              href="/articles/new"
              className="block text-center py-2 rounded-md text-xs font-medium bg-zinc-900 border border-zinc-700 text-zinc-100"
            >
              + Rédiger un article
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block text-center py-2 rounded-md text-xs font-medium border border-zinc-800 bg-zinc-950 text-white"
                >
                  Mon profil ({user.email})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center py-2 rounded-md text-xs text-zinc-400 hover:text-white"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-center py-2 rounded-md text-xs font-semibold bg-white text-black"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
