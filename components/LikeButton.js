'use client';

import { useState } from 'react';
import { toggleLike } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';

export default function LikeButton({ articleId, initialCount = 0 }) {
  const [likes, setLikes] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    setAuthError(false);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setAuthError(true);
        setLoading(false);
        return;
      }

      // Optimistic update
      const nextLiked = !hasLiked;
      setHasLiked(nextLiked);
      setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

      await toggleLike(articleId, user.id);
    } catch {
      // Revert if error
      setHasLiked((prev) => !prev);
      setLikes((prev) => (hasLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
          hasLiked
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-sm'
            : 'bg-slate-800/70 border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-white'
        }`}
      >
        <span className={hasLiked ? 'scale-110 transition-transform' : ''}>
          {hasLiked ? '❤️' : '🤍'}
        </span>
        <span>{hasLiked ? 'Aimé' : "J'aime"}</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-900/60 text-xs font-bold text-slate-300">
          {likes}
        </span>
      </button>

      {authError && (
        <span className="text-xs text-amber-400 mt-1">
          Connectez-vous pour pouvoir liker cet article.
        </span>
      )}
    </div>
  );
}
