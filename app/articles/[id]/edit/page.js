'use client';

// CSR + route protégée : seul l'auteur peut modifier (vérifié ici et par les règles RLS)
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getArticleById, updateArticle } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';
import ArticleForm from '@/components/ArticleForm';

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await createClient().auth.getUser();
      const art = await getArticleById(id);

      if (!art) return router.push('/articles');
      if (!user || (art.user_id && art.user_id !== user.id)) return router.push(`/articles/${id}`);

      setArticle(art);
    }
    load();
  }, [id, router]);

  const handleUpdate = async (fields) => {
    await updateArticle(id, fields);
    router.push(`/articles/${id}`);
    router.refresh();
  };

  if (!article) {
    return <p className="page text-sm text-zinc-500">Chargement...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <span className="badge">CSR · route protégée</span>
        <h1>Modifier l&apos;article</h1>
      </div>
      <ArticleForm initial={article} submitLabel="Enregistrer" onSubmit={handleUpdate} />
    </div>
  );
}
