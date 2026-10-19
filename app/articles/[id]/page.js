import LikeButton from '@/components/LikeButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById, getStaticArticleIds } from '@/lib/articles';

export async function generateStaticParams() {
  const ids = await getStaticArticleIds();
  return ids.map((id) => ({ id: String(id) }));
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link href="/articles" className="text-xs text-blue-400">← Retour</Link>
      <h1 className="text-4xl font-extrabold text-white">{article.title}</h1>
      <p className="text-slate-300 italic">{article.summary}</p>
      <div className="pt-2"><LikeButton articleId={article.id} initialCount={article.likes_count || 0} /></div>
      <div className="text-slate-300 whitespace-pre-wrap">{article.content}</div>
    </div>
  );
}
