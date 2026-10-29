'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function GitHubIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const router = useRouter();

  const [showEmail, setShowEmail] = useState(false);
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const signInWithGitHub = async () => {
    setMessage('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setMessage(error.message);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient();
    const { error } = signup
      ? await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: email.split('@')[0] } } })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else if (signup) {
      setMessage('Compte créé. Vous pouvez maintenant vous connecter.');
      setSignup(false);
    } else {
      router.push(next);
      router.refresh();
    }
  };

  const continueAsGuest = () => {
    document.cookie = 'devboard_guest=1; path=/; max-age=2592000; samesite=lax';
    router.push(next);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl">DevBoard</h1>
          <p className="text-sm text-zinc-400">Articles et veille technique entre développeurs.</p>
        </div>

        <div className="space-y-3">
          <button type="button" onClick={signInWithGitHub} className="btn btn-primary w-full py-2.5">
            <GitHubIcon />
            Se connecter avec GitHub
          </button>

          {!showEmail && (
            <button type="button" onClick={() => setShowEmail(true)} className="btn btn-secondary w-full py-2.5">
              Utiliser un email
            </button>
          )}
        </div>

        {showEmail && (
          <form onSubmit={handleEmail} className="space-y-3 text-left">
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
            </div>
            <div>
              <label htmlFor="password">Mot de passe</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-secondary w-full">
              {loading ? 'Chargement...' : signup ? 'Créer le compte' : 'Se connecter'}
            </button>
            <button type="button" onClick={() => setSignup(!signup)} className="link text-xs w-full text-center">
              {signup ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? En créer un'}
            </button>
          </form>
        )}

        {message && <p className="text-xs text-zinc-300">{message}</p>}

        <button type="button" onClick={continueAsGuest} className="link text-xs">
          Continuer sans compte
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
