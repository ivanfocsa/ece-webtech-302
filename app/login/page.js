'use client';

// ==============================================================================
// 5. STRATÉGIE CSR (Client-Side Rendering)
// Interface d'authentification double flux (GitHub OAuth 2.0 & Email/Mot de passe).
// ==============================================================================

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/profile';
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';

  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const router = useRouter();

  const handleOAuthGitHub = async () => {
    setErrorMsg('');
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
    } catch (err) {
      setErrorMsg(`Erreur GitHub OAuth : ${err.message}`);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const supabase = createClient();

    try {
      if (tab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        router.push(next);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0],
            },
          },
        });

        if (error) throw error;
        setSuccessMsg('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setTab('signin');
      }
    } catch (err) {
      setErrorMsg(err.message || "Une erreur est survenue lors de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-9 h-9 rounded bg-white text-black mx-auto flex items-center justify-center text-sm font-bold">
            ⚡
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Bienvenue sur DevBoard</h1>
          <p className="text-xs text-zinc-400">
            Connectez-vous pour publier, liker et commenter des articles techniques.
          </p>
        </div>

        {/* Bouton GitHub OAuth 2.0 */}
        <button
          type="button"
          onClick={handleOAuthGitHub}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>Continuer avec GitHub</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-zinc-950 px-3 text-[11px] text-zinc-500 uppercase tracking-wider relative font-mono">
            ou par email
          </span>
        </div>

        {/* Sélecteur d'onglets Connexion / Inscription */}
        <div className="flex bg-black p-1 rounded-md border border-zinc-800">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              tab === 'signin' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              tab === 'signup' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-zinc-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-white">
            {successMsg}
          </div>
        )}

        {/* Formulaire Email */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {tab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex: Alex Dupont"
                className="w-full bg-black border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
              Adresse email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@domaine.com"
              required
              className="w-full bg-black border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
              Mot de passe *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-black border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md text-xs font-semibold bg-white hover:bg-zinc-200 text-black disabled:opacity-50 transition-colors"
          >
            {loading
              ? 'Traitement...'
              : tab === 'signin'
              ? 'Se connecter'
              : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-16 text-center text-xs text-zinc-500 font-mono">
          Chargement du formulaire...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
