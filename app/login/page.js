'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [tab, setTab] = useState('signin');
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">DevBoard Auth</h1>
        <div className="flex bg-slate-950 p-1 rounded-lg">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded ${tab === 'signin' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded ${tab === 'signup' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Inscription
          </button>
        </div>
      </div>
    </div>
  );
}
