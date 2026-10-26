import Link from 'next/link';

export default function ArticleCard({ article }) {
  const dateFormatted = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="group relative flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg p-5 hover:border-zinc-600 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
          {article.category}
        </span>
        <span className="text-xs text-zinc-500 font-mono">
          {article.likes_count ?? 0} likes
        </span>
      </div>

      <h3 className="text-sm font-semibold text-white group-hover:text-zinc-300 transition-colors line-clamp-2 mb-1.5">
        <Link href={`/articles/${article.id}`}>
          <span className="absolute inset-0" />
          {article.title}
        </Link>
      </h3>

      <p className="text-xs text-zinc-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
        {article.summary}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-900 text-[11px] text-zinc-400">
        <span className="text-zinc-300">{article.author_name || 'Utilisateur'}</span>
        <time dateTime={article.created_at} className="font-mono text-zinc-500">{dateFormatted}</time>
      </div>
    </article>
  );
}
