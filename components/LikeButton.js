'use client';

import { useState } from 'react';
import { toggleLike } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';

// CSR : mise à jour optimiste du compteur, puis enregistrement dans Supabase
export default function LikeButton({ articleId, initialCount = 0 }) {
  const [likes, setLikes] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);

  const handleLike = async () => {
    const { data: { user } } = await createClient().auth.getUser();
    if (!user) {
      setNeedLogin(true);
      return;
    }

    setLiked(!liked);
    setLikes(likes + (liked ? -1 : 1));

    try {
      await toggleLike(articleId, user.id);
    } catch {
      setLiked(liked);
      setLikes(likes);
    }
  };

  if (needLogin) {
    return <a href="/login" className="link text-xs">Connectez-vous pour aimer</a>;
  }

  return (
    <button
      onClick={handleLike}
      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
        liked ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-300 hover:border-zinc-600'
      }`}
    >
      ♥ {likes}
    </button>
  );
}
