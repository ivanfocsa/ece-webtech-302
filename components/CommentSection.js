'use client';

import { useState, useEffect } from 'react';
import { getArticleComments, addComment, deleteComment } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';

// CSR : commentaires chargés et ajoutés côté client
export default function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user)).catch(() => {});
    getArticleComments(articleId).then((data) => setComments(data || [])).catch(() => {});
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const newComment = await addComment({
        articleId,
        userId: user.id,
        authorName: user.user_metadata?.full_name || user.email?.split('@')[0],
        content: content.trim(),
      });
      setComments([...comments, newComment]);
      setContent('');
    } catch {
      alert("Erreur lors de l'ajout du commentaire.");
    }
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    try {
      await deleteComment(commentId, user.id);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <section className="space-y-6 border-t border-zinc-900 pt-8">
      <h2>Commentaires ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Votre commentaire..."
            rows={3}
            className="input resize-none"
          />
          <button type="submit" disabled={loading || !content.trim()} className="btn btn-primary">
            Commenter
          </button>
        </form>
      ) : (
        <p className="text-sm text-zinc-500">
          <a href="/login" className="underline text-zinc-300">Connectez-vous</a> pour commenter.
        </p>
      )}

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>
                <span className="text-zinc-300">{c.author_name || 'Anonyme'}</span> ·{' '}
                {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
              {user?.id === c.user_id && (
                <button onClick={() => handleDelete(c.id)} className="link">Supprimer</button>
              )}
            </div>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap">{c.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
