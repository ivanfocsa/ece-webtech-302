import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById, getStaticArticleIds } from '@/lib/articles';
import { createClient } from '@/lib/supabase/server';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import DeleteArticleButton from '@/components/DeleteArticleButton';

// ==============================================================================
// 2. STRATÉGIE SSG DYNAMIQUE (Static Site Generation avec generateStaticParams)
// Les pages d'articles connus sont générées au build pour un chargement instantané.
// ==============================================================================
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

  // Vérifier si le visiteur est l'auteur de l'article pour afficher Édition / Suppression
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthor = user && user.id === article.user_id;

  const dateFormatted = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Fil d'Ariane & Actions auteur */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <Link href="/articles" className="hover:text-white flex items-center gap-1 transition-colors">
          ← Retour aux articles
        </Link>
        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link
              href={`/articles/${article.id}/edit`}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors"
            >
              Modifier
            </Link>
            <DeleteArticleButton articleId={article.id} />
          </div>
        )}
      </div>

      {/* En-tête de l'article */}
      <header className="space-y-4 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
            {article.category}
          </span>
          <span className="text-xs text-zinc-600">•</span>
          <span className="text-xs text-zinc-400 font-mono">{article.reading_time || '4 min'} de lecture</span>
          <span className="text-xs text-zinc-600">•</span>
          <span className="text-[11px] text-zinc-500 font-mono">SSG Dynamique</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed italic border-l border-zinc-600 pl-4 py-1">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white text-xs">
              {(article.author_name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{article.author_name}</div>
              <div className="text-[11px] text-zinc-500 font-mono">Publié le {dateFormatted}</div>
            </div>
          </div>

          <LikeButton articleId={article.id} initialCount={article.likes_count || 0} />
        </div>
      </header>

      {/* Contenu principal */}
      <div className="article-prose text-zinc-300 space-y-4 whitespace-pre-wrap leading-relaxed text-sm">
        {article.content}
      </div>

      {/* Espace Commentaires (Client Component) */}
      <CommentSection articleId={article.id} />
    </div>
  );
}
