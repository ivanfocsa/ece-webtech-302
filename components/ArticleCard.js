import Link from 'next/link';

export default function ArticleCard({ article }) {
  const date = new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return (
    <Link href={`/articles/${article.id}`} className="card p-5 flex flex-col gap-3 hover:border-zinc-600 transition-colors">
      <span className="text-xs text-zinc-500">{article.category}</span>
      <h3 className="font-medium text-white leading-snug line-clamp-2">{article.title}</h3>
      <p className="text-sm text-zinc-400 line-clamp-2 flex-1">{article.summary}</p>
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{article.author_name || 'Anonyme'} · {date}</span>
        <span>{article.likes_count ?? 0} ♥</span>
      </div>
    </Link>
  );
}
