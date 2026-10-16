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
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          CSR & Route Protégée
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Rédiger un nouvel article
        </h1>
        <p className="text-sm text-slate-400">
          Partagez une astuce, une analyse ou un retour d&apos;expérience avec la communauté.
        </p>
      </div>

      {/* Onglets Éditeur / Prévisualisation */}
      <div className="flex border-b border-slate-800">
        <button
          type="button"
          onClick={() => setPreviewTab(false)}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            !previewTab
              ? 'border-blue-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Éditeur
        </button>
        <button
          type="button"
          onClick={() => setPreviewTab(true)}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            previewTab
              ? 'border-blue-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Prévisualisation
        </button>
      </div>

      {!previewTab ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Titre de l&apos;article *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Sécuriser vos APIs avec Row Level Security"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Auteur
              </label>
              <input
                type="text"
                disabled
                value={user?.user_metadata?.full_name || user?.email || 'Chargement...'}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Résumé d&apos;accroche (1-2 phrases) *
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Un résumé concis qui s'affichera sur la carte d'article..."
              rows={2}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Contenu de l&apos;article *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez votre article technique avec vos explications, code snippets et conclusions..."
              rows={12}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md shadow-blue-500/20 transition-all"
            >
              {loading ? 'Publication en cours...' : "Publier l'article"}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
          <span className="text-xs uppercase font-bold text-blue-400">{category}</span>
          <h2 className="text-3xl font-extrabold text-white">{title || "Titre de l'article"}</h2>
          <p className="text-base text-slate-300 italic border-l-2 border-blue-500 pl-3">
            {summary || "Résumé d'accroche..."}
          </p>
          <div className="pt-4 border-t border-slate-800/80 text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
            {content || "Contenu complet de l'article..."}
          </div>
        </div>
      )}
    </div>
  );
}
