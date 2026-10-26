import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById, getStaticArticleIds } from '@/lib/articles';
import { createClient } from '@/lib/supabase/server';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import DeleteArticleButton from '@/components/DeleteArticleButton';

export async function generateStaticParams() {
  const ids = await getStaticArticleIds();
  return ids.map((id) => ({ id: String(id) }));
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthor = user && user.id === article.user_id;

  const dateFormatted = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <Link href="/articles" className="hover:text-white transition-colors">
          ← Retour aux articles
        </Link>
        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link
              href={`/articles/${article.id}/edit`}
              className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
            >
              Modifier
            </Link>
            <DeleteArticleButton articleId={article.id} />
          </div>
        )}
      </div>

      <header className="space-y-3 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
            {article.category}
          </span>
          <span className="text-xs text-zinc-600">•</span>
          <span className="text-xs text-zinc-500 font-mono">SSG Dynamique</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
          {article.title}
        </h1>

        <p className="text-sm text-zinc-400 leading-relaxed italic border-l border-zinc-700 pl-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-3 text-xs">
          <div>
            <span className="text-white font-medium">{article.author_name || 'Utilisateur'}</span>
            <span className="text-zinc-500 font-mono ml-2">le {dateFormatted}</span>
          </div>

          <LikeButton articleId={article.id} initialCount={article.likes_count || 0} />
        </div>
      </header>

      <div className="article-prose text-zinc-300 space-y-4 whitespace-pre-wrap leading-relaxed text-sm">
        {article.content}
      </div>

      <CommentSection articleId={article.id} />
    </div>
  );
}
