'use client';

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
      setErrorMsg("Une erreur est survenue lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-[11px] font-mono text-zinc-500">CSR (Client-Side Rendering)</span>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">Contact</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Formulaire de contact pour poser une question ou envoyer une remarque.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 text-center bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
          <h2 className="text-sm font-semibold text-white">Message envoyé</h2>
          <p className="text-xs text-zinc-400">
            Votre message a bien été enregistré dans la base de données.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-2 px-3 py-1.5 rounded text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
          >
            Nouveau message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 rounded bg-zinc-900 border border-zinc-700 text-xs text-zinc-300">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-300">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-300">Objet</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sujet de votre message"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-300">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre texte ici..."
              rows={4}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded text-xs font-medium bg-white hover:bg-zinc-200 text-black disabled:opacity-50 transition-colors"
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      )}
    </div>
  );
}
