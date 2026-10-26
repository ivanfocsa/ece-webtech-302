'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';

const categories = ['Frontend', 'Backend', 'DevOps', 'Architecture', 'Sécurité'];

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [previewTab, setPreviewTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login?next=/articles/new');
      } else {
        setUser(user);
      }
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary || !content) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const authorName =
        user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Auteur';

      const created = await createArticle({
        title,
        category,
        summary,
        content,
        userId: user.id,
        authorName,
      });

      router.push(`/articles/${created.id}`);
      router.refresh();
    } catch (err) {
      alert(`Erreur : ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-zinc-800 pb-3">
        <span className="text-[11px] font-mono text-zinc-500">CSR (Route protégée)</span>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Rédiger un article
        </h1>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-zinc-800 text-xs">
        <button
          type="button"
          onClick={() => setPreviewTab(false)}
          className={`px-3 py-2 font-medium border-b-2 transition-colors ${
            !previewTab ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Formulaire
        </button>
        <button
          type="button"
          onClick={() => setPreviewTab(true)}
          className={`px-3 py-2 font-medium border-b-2 transition-colors ${
            previewTab ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Aperçu
        </button>
      </div>

      {!previewTab ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-300">Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Introduction aux politiques RLS"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-300">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-300">Auteur</label>
              <input
                type="text"
                disabled
                value={user?.user_metadata?.full_name || user?.email || 'Chargement...'}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded px-3 py-2 text-zinc-500 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-300">Résumé *</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Courte description de l'article..."
              rows={2}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-300">Contenu *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Texte de l'article..."
              rows={10}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 leading-relaxed font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded text-xs font-medium bg-white hover:bg-zinc-200 text-black disabled:opacity-50 transition-colors"
            >
              {loading ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 bg-zinc-950 border border-zinc-800 rounded-lg p-5">
          <div className="border-b border-zinc-800 pb-3 space-y-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
              {category}
            </span>
            <h2 className="text-lg font-bold text-white">{title || 'Sans titre'}</h2>
            <p className="text-xs text-zinc-400 italic">{summary || 'Aucun résumé.'}</p>
          </div>
          <div className="text-zinc-300 whitespace-pre-wrap text-xs leading-relaxed font-mono">
            {content || 'Pas de contenu.'}
          </div>
        </div>
      )}
    </div>
  );
}
