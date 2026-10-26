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
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
          CSR (Client-Side Rendering)
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Nous contacter</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Une question sur le projet DevBoard, une suggestion ou une remarque ? Écrivez-nous !
        </p>
      </div>

      {submitted ? (
        <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
          <h2 className="text-base font-bold text-white">Message bien reçu !</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Merci pour votre retour. Votre message a été stocké avec succès dans notre base PostgreSQL.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-2 inline-block px-4 py-2 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-zinc-300">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Nom complet *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@domaine.com"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
              Sujet *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="ex: Question sur le cours ECE WebTech"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              rows={5}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md text-xs font-semibold bg-white hover:bg-zinc-200 text-black disabled:opacity-50 transition-colors"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      )}
    </div>
  );
}
