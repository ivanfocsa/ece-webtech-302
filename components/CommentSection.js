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
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    getArticleComments(articleId).then((data) => {
      setComments(data || []);
      setFetching(false);
    });
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
    <section className="mt-12 pt-8 border-t border-slate-800">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span>💬</span> Commentaires ({comments.length})
      </h3>

      {/* Formulaire de saisie */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez votre avis technique ou posez une question..."
              rows={3}
              required
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-2">
              <span className="text-xs text-slate-400">
                Connecté en tant que <span className="text-slate-300 font-semibold">{user.email}</span>
              </span>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="px-4 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
              >
                {loading ? 'Publication...' : 'Commenter'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 mb-8 text-center text-sm text-slate-400">
          Vous devez être{' '}
          <a href="/login" className="text-blue-400 underline font-semibold">
            connecté
          </a>{' '}
          pour laisser un commentaire.
        </div>
      )}

      {/* Liste des commentaires */}
      {fetching ? (
        <div className="text-sm text-slate-500">Chargement des commentaires...</div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 italic">{"Aucun commentaire pour l'instant. Soyez le premier à réagir !"}</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-blue-400 text-xs font-bold flex items-center justify-center">
                    {(comment.author_name || 'U')[0].toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {comment.author_name || 'Utilisateur'}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <time className="text-[11px] text-slate-500">
                    {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </time>
                </div>

                {user && user.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                    title="Supprimer ce commentaire"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
