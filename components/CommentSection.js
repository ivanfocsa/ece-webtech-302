'use client';

import { useState, useEffect } from 'react';
import { getArticleComments, addComment, deleteComment } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';

export default function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (key && key !== 'placeholder-anon-key' && key.length > 20) {
      try {
        const supabase = createClient();
        supabase.auth.getUser()
          .then(({ data: { user } }) => {
            setUser(user ?? null);
          })
          .catch(() => {});
      } catch {
        // Fallback silencieux
      }
    }

    getArticleComments(articleId)
      .then((data) => {
        setComments(data || []);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      const authorName =
        user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur';

      const newCom = await addComment({
        articleId,
        userId: user.id,
        authorName,
        content: content.trim(),
      });

      setComments((prev) => [...prev, newCom]);
      setContent('');
    } catch {
      alert("Erreur lors de l'ajout du commentaire.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Supprimer ce commentaire ?')) return;

    try {
      await deleteComment(commentId, user.id);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-zinc-800">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <span>Commentaires</span>
        <span className="text-xs font-mono text-zinc-500 font-normal">({comments.length})</span>
      </h3>

      {/* Formulaire de saisie */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 focus-within:border-zinc-500 transition-colors">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez votre avis technique..."
              rows={3}
              required
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 mt-2">
              <span className="text-xs text-zinc-500">
                Connecté en tant que <span className="text-zinc-300 font-mono">{user.email}</span>
              </span>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-zinc-200 disabled:opacity-50 text-black transition-colors"
              >
                {loading ? 'Publication...' : 'Commenter'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 mb-8 text-center text-xs text-zinc-400">
          Vous devez être{' '}
          <a href="/login" className="text-white underline font-semibold">
            connecté
          </a>{' '}
          pour laisser un commentaire.
        </div>
      )}

      {/* Liste des commentaires */}
      {fetching ? (
        <div className="text-xs text-zinc-500 font-mono">Chargement des commentaires...</div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-zinc-500 italic">{"Aucun commentaire pour l'instant."}</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center justify-center">
                    {(comment.author_name || 'U')[0].toUpperCase()}
                  </span>
                  <span className="text-xs font-medium text-zinc-200">
                    {comment.author_name || 'Utilisateur'}
                  </span>
                  <span className="text-xs text-zinc-600">•</span>
                  <time className="text-[11px] text-zinc-500 font-mono">
                    {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </time>
                </div>

                {user && user.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-zinc-500 hover:text-white transition-colors"
                    title="Supprimer ce commentaire"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
