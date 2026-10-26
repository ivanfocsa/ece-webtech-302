'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Auto-close mobile drawer on route navigation
export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    // Récupérer la session courante
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                ⚡
              </span>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Dev<span className="text-blue-500">Board</span>
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Actions Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/articles/new"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
                >
                  <span className="mr-1.5 text-sm">+</span> Publier
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate text-xs font-medium">
                    {user.user_metadata?.full_name || user.email.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/login?tab=signup"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
                >
                  {"S'inscrire"}
                </Link>
              </div>
            )}
          </div>

          {/* Bouton Hamburger Mobile */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <span className="text-xl font-bold">✕</span>
              ) : (
                <span className="text-xl font-bold">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  href="/articles/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-md text-sm font-semibold bg-blue-600 text-white"
                >
                  + Rédiger un article
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  Mon Profil ({user.email})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-center py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md text-sm font-medium text-slate-300 bg-slate-800"
                >
                  Connexion
                </Link>
                <Link
                  href="/login?tab=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md text-sm font-semibold bg-blue-600 text-white"
                >
                  {"S'inscrire"}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
