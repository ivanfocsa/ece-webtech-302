'use client';

import { useState, useEffect, useRef } from 'react';
import { toggleLike, getArticleLikes } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';

export default function LikeButton({ articleId, initialCount = 0 }) {
  const [likes, setLikes] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [ready, setReady] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    let revision = 0;
    const load = async (user) => {
      const current = ++revision;
      if (active) setReady(false);
      try {
        const state = await getArticleLikes(articleId, user?.id);
        if (active && current === revision) {
          setLikes(state.count);
          setHasLiked(state.userHasLiked);
          setErrorMsg('');
          setReady(true);
        }
      } catch {
        if (active && current === revision) setErrorMsg('Impossible de charger les likes. Actualisez la page pour réessayer.');
      }
    };
    supabase.auth.getUser().then(({ data }) => load(data.user)).catch(() => load(null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Les appels Supabase doivent être effectués hors du callback Auth.
      setTimeout(() => { if (active) load(session?.user); }, 0);
    });
    return () => { active = false; revision++; subscription.unsubscribe(); };
  }, [articleId]);

  const handleLike = async () => {
    if (busy.current || !ready) return;
    busy.current = true;
    setLoading(true);
    setAuthError(false);
    setErrorMsg('');
    const previous = { count: likes, liked: hasLiked };
    let optimistic = false;
    let saved = false;
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) { setAuthError(true); return; }
      optimistic = true;
      setHasLiked(!previous.liked);
      setLikes(Math.max(0, previous.count + (previous.liked ? -1 : 1)));
      const result = await toggleLike(articleId, user.id);
      saved = true;
      setHasLiked(result.liked);
      setLikes(result.count ?? Math.max(0, previous.count + (Number(result.liked) - Number(previous.liked))));
      const state = await getArticleLikes(articleId, user.id);
      setLikes(state.count);
      setHasLiked(state.userHasLiked);
    } catch {
      if (optimistic && !saved) {
        setHasLiked(previous.liked);
        setLikes(previous.count);
      }
      setErrorMsg(saved ? 'Like enregistré, mais le compteur ne peut pas être actualisé.' : 'Impossible de modifier le like. Veuillez réessayer.');
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleLike}
        disabled={loading || !ready}
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

      {errorMsg && <span role="alert" className="text-xs text-zinc-400">{errorMsg}</span>}
      {authError && (
        <span className="text-[11px] text-zinc-400 mt-1 font-mono">
          Connectez-vous pour pouvoir liker cet article.
        </span>
      )}
    </div>
  );
}
