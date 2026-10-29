'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = ['Frontend', 'Backend', 'DevOps', 'Architecture', 'Sécurité'];

// Formulaire partagé entre la création et la modification d'un article
export default function ArticleForm({ initial = {}, submitLabel, onSubmit }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title || '');
  const [category, setCategory] = useState(initial.category || 'Frontend');
  const [summary, setSummary] = useState(initial.summary || '');
  const [content, setContent] = useState(initial.content || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, category, summary, content });
    } catch (err) {
      alert(`Erreur : ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title">Titre</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input" />
      </div>

      <div>
        <label htmlFor="category">Catégorie</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="input">
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="summary">Résumé</label>
        <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} required className="input resize-none" />
      </div>

      <div>
        <label htmlFor="content">Contenu</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} required className="input font-mono" />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => router.back()} className="btn link">Annuler</button>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Enregistrement...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
