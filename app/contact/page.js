'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-white">Contact</h1>
      {sent ? (
        <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded">Message envoyé !</div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white"
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            rows={4}
            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white"
            required
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Envoyer</button>
        </form>
      )}
    </div>
  );
}
