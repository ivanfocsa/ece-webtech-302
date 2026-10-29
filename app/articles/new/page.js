'use client';

// CSR + route protégée par le middleware
import { useRouter } from 'next/navigation';
import { createArticle } from '@/lib/articles';
import { createClient } from '@/lib/supabase/client';
import ArticleForm from '@/components/ArticleForm';

export default function NewArticlePage() {
  const router = useRouter();

  const handleCreate = async (fields) => {
    const { data: { user } } = await createClient().auth.getUser();
    if (!user) {
      router.push('/login?next=/articles/new');
      return;
    }

    const created = await createArticle({
      ...fields,
      userId: user.id,
      authorName: user.user_metadata?.full_name || user.email?.split('@')[0],
    });

    router.push(`/articles/${created.id}`);
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <span className="badge">CSR · route protégée</span>
        <h1>Écrire un article</h1>
      </div>
      <ArticleForm submitLabel="Publier" onSubmit={handleCreate} />
    </div>
  );
}
