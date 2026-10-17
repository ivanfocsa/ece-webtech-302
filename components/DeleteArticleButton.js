'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteArticle } from '@/lib/articles';

export default function DeleteArticleButton({ articleId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      return;
    }

    setLoading(true);
    try {
      await deleteArticle(articleId);
      router.push('/articles');
      router.refresh();
    } catch {
      alert("Erreur lors de la suppression de l'article.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 transition-colors"
    >
      {loading ? 'Suppression...' : "Supprimer l'article"}
    </button>
  );
}
