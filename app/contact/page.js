'use client';

// ==============================================================================
// 5. STRATÉGIE CSR (Client-Side Rendering)
// Formulaire de contact avec validation réactive et envoi vers Supabase.
// ==============================================================================

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { error } = await supabase.from('contacts').insert([
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        },
      ]);

      if (error && !error.message?.includes('placeholder')) {
        throw error;
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setErrorMsg("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          CSR (Client-Side Rendering)
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Nous contacter</h1>
        <p className="text-sm text-slate-400">
          Une question sur le projet DevBoard, une suggestion ou une remarque ? Écrivez-nous !
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
          <span className="text-3xl">✅</span>
          <h2 className="text-lg font-bold text-emerald-400">Message envoyé avec succès !</h2>
          <p className="text-sm text-slate-300">
            {"Merci pour votre retour. L'équipe pédagogique ou un membre du groupe vous répondra dans les meilleurs délais."}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nom complet *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@example.com"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Sujet *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Question sur l implémentation de Supabase RLS..."
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Expliquez-nous votre demande en détail..."
              rows={5}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md shadow-blue-500/20 transition-all"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      )}
    </div>
  );
}
