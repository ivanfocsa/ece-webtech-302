'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [tab, setTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const supabase = createClient();

    try {
      if (tab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        router.push('/profile');
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } }
        });
        if (error) throw error;
        setTab('signin');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">DevBoard Auth</h1>
        {errorMsg && <div className="p-3 bg-red-500/10 text-red-400 text-xs rounded">{errorMsg}</div>}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {tab === 'signup' && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nom complet"
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-sm"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-sm"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded"
          >
            {loading ? 'Chargement...' : tab === 'signin' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>
      </div>
    </div>
  );
}
