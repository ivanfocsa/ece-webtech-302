import Link from 'next/link';

export default function ArticleCard({ article }) {
  const dateFormatted = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="group relative flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg p-5 hover:border-zinc-500 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
          {article.category}
        </span>
        <span className="text-xs text-zinc-500 flex items-center gap-1 font-mono">
          <span>♡</span> {article.likes_count ?? 0}
        </span>
      </div>

      <h3 className="text-base font-semibold text-white group-hover:text-zinc-300 transition-colors line-clamp-2 mb-2">
        <Link href={`/articles/${article.id}`}>
          <span className="absolute inset-0" />
          {article.title}
        </Link>
      </h3>

      <p className="text-xs text-zinc-400 line-clamp-3 mb-4 flex-1 leading-relaxed">
        {article.summary}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300 text-[10px]">
            {article.author_name ? article.author_name[0].toUpperCase() : 'U'}
          </span>
          <span className="font-medium text-zinc-300">{article.author_name}</span>
        </div>
        <time dateTime={article.created_at} className="font-mono text-zinc-500">{dateFormatted}</time>
      </div>
    </article>
  );
}
