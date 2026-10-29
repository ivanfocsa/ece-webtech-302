'use client';

// CSR : formulaire géré côté client, message enregistré dans la table contacts
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const empty = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('idle');

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await createClient().from('contacts').insert([form]);
    if (error) {
      setStatus('error');
    } else {
      setStatus('sent');
      setForm(empty);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <span className="badge">CSR</span>
        <h1>Contact</h1>
        <p className="text-sm text-zinc-400">Une question ou une remarque sur le projet ?</p>
      </div>

      {status === 'sent' ? (
        <div className="card p-6 space-y-3">
          <p className="text-sm">Message envoyé, merci.</p>
          <button onClick={() => setStatus('idle')} className="link text-sm">Envoyer un autre message</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name">Nom</label>
              <input id="name" name="name" value={form.name} onChange={update} required className="input" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={update} required className="input" />
            </div>
          </div>
          <div>
            <label htmlFor="subject">Objet</label>
            <input id="subject" name="subject" value={form.subject} onChange={update} required className="input" />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={update} rows={5} required className="input resize-none" />
          </div>
          {status === 'error' && <p className="text-xs text-zinc-300">Une erreur est survenue, réessayez.</p>}
          <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full">
            {status === 'sending' ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      )}
    </div>
  );
}
