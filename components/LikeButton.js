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
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
          hasLiked
            ? 'bg-white text-black border-white'
            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-white'
        }`}
      >
        <span>{hasLiked ? '♥' : '♡'}</span>
        <span>{hasLiked ? 'Aimé' : "J'aime"}</span>
        <span
          className={`ml-1 px-1.5 py-0.2 rounded text-[11px] font-mono ${
            hasLiked ? 'bg-zinc-200 text-black' : 'bg-zinc-900 text-zinc-400'
          }`}
        >
          {likes}
        </span>
      </button>

      {authError && (
        <span className="text-[11px] text-zinc-400 mt-1 font-mono">
          Connectez-vous pour pouvoir liker cet article.
        </span>
      )}
    </div>
  );
}
