'use client';

// ==============================================================================
// 5. STRATÉGIE CSR (Client-Side Rendering) & ROUTE PROTÉGÉE
// Géré par un formulaire client interactif avec prévisualisation.
// Protégé par middleware.js (redirection si non authentifié).
// ==============================================================================

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
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      const authorName =
        user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Auteur DevBoard';

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
      alert(`Erreur lors de la création de l article : ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
          CSR & Route Protégée
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Rédiger un nouvel article
        </h1>
        <p className="text-xs text-zinc-400">
          Partagez une analyse technique ou un retour d&apos;expérience avec la communauté.
        </p>
      </div>

      {/* Onglets Éditeur / Prévisualisation */}
      <div className="flex border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setPreviewTab(false)}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            !previewTab
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Éditeur
        </button>
        <button
          type="button"
          onClick={() => setPreviewTab(true)}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            previewTab
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Prévisualisation
        </button>
      </div>

      {!previewTab ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
              Titre de l&apos;article *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Sécuriser vos APIs avec Row Level Security"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Auteur
              </label>
              <input
                type="text"
                disabled
                value={user?.user_metadata?.full_name || user?.email || 'Chargement...'}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-md px-3.5 py-2.5 text-zinc-500 text-xs font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
              Résumé introductif * (1 à 2 phrases)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Synthèse claire pour le catalogue..."
              rows={2}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
              Corps de l&apos;article * (Format texte ou Markdown simple)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez votre contenu ici..."
              rows={12}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs leading-relaxed font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md text-xs font-semibold bg-white hover:bg-zinc-200 text-black disabled:opacity-50 transition-colors"
            >
              {loading ? 'Publication en cours...' : 'Publier l article'}
            </button>
          </div>
        </form>
      ) : (
        /* Vue Prévisualisation */
        <div className="space-y-6 bg-zinc-950 border border-zinc-800 rounded-lg p-6">
          <div className="border-b border-zinc-800 pb-4 space-y-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
              {category}
            </span>
            <h2 className="text-2xl font-bold text-white">{title || 'Titre non renseigné'}</h2>
            <p className="text-xs text-zinc-400 italic">{summary || 'Résumé non renseigné'}</p>
          </div>
          <div className="article-prose text-zinc-300 whitespace-pre-wrap text-xs">
            {content || 'Aucun contenu rédigé pour le moment.'}
          </div>
        </div>
      )}
    </div>
  );
}
