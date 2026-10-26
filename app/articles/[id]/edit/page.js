'use client';

// ==============================================================================
// 5. STRATÉGIE CSR (Client-Side Rendering) & ROUTE PROTÉGÉE (Édition)
// ==============================================================================

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getArticleById, updateArticle } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';

const categories = ['Frontend', 'Backend', 'DevOps', 'Architecture', 'Sécurité'];

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadAndVerify() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?next=/articles/${id}/edit`);
        return;
      }

      const art = await getArticleById(id);
      if (!art) {
        router.push('/articles');
        return;
      }

      // Vérification RLS côté client
      if (art.user_id && art.user_id !== user.id) {
        alert('Action non autorisée : vous n êtes pas l auteur de cet article.');
        router.push(`/articles/${id}`);
        return;
      }

      setTitle(art.title || '');
      setCategory(art.category || 'Frontend');
      setSummary(art.summary || '');
      setContent(art.content || '');
      setFetching(false);
    }

    if (id) loadAndVerify();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateArticle(id, {
        title,
        category,
        summary,
        content,
      });

      router.push(`/articles/${id}`);
      router.refresh();
    } catch (err) {
      alert(`Erreur lors de la modification : ${err.message}`);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-xs text-zinc-500 font-mono">
        Chargement de l article...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
          Modification d article (Auteur vérifié)
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Modifier l&apos;article
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
            Titre de l&apos;article *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
          />
        </div>

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
            Résumé *
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
            Contenu *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
