import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById, getStaticArticleIds } from '@/lib/articles';
import { createClient } from '@/lib/supabase/server';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import DeleteArticleButton from '@/components/DeleteArticleButton';

// SSG dynamique : les articles existants sont pré-générés au build
export async function generateStaticParams() {
  const ids = await getStaticArticleIds();
  return ids.map((id) => ({ id: String(id) }));
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthor = user && user.id === article.user_id;

  const date = new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <article className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between text-sm">
        <Link href="/articles" className="link">← Articles</Link>
        {isAuthor && (
          <div className="flex items-center gap-4">
            <Link href={`/articles/${article.id}/edit`} className="link">Modifier</Link>
            <DeleteArticleButton articleId={article.id} />
          </div>
        )}
      </div>

      <header className="space-y-4">
        <div className="flex gap-2">
          <span className="badge">SSG dynamique</span>
          <span className="badge">{article.category}</span>
        </div>
        <h1 className="leading-tight">{article.title}</h1>
        <p className="text-zinc-400">{article.summary}</p>
        <div className="flex items-center justify-between pt-2 text-sm text-zinc-500">
          <span>{article.author_name || 'Anonyme'} · {date}</span>
          <LikeButton articleId={article.id} initialCount={article.likes_count || 0} />
        </div>
      </header>

      <div className="article-prose whitespace-pre-wrap border-t border-zinc-900 pt-8">{article.content}</div>

      <CommentSection articleId={article.id} />
    </article>
  );
}
