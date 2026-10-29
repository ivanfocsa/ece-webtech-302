'use client';

import { useRouter } from 'next/navigation';
import { deleteArticle } from '@/lib/articles';

export default function DeleteArticleButton({ articleId }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      await deleteArticle(articleId);
      router.push('/articles');
      router.refresh();
    } catch {
      alert("Erreur lors de la suppression de l'article.");
    }
  };

  return (
    <button onClick={handleDelete} className="link">
      Supprimer
    </button>
  );
}
