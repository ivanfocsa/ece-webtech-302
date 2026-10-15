import Link from 'next/link';

const categoryColors = {
  Frontend: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Backend: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  DevOps: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Architecture: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Sécurité: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function ArticleCard({ article }) {
  const badgeClass =
    categoryColors[article.category] || 'bg-slate-800 text-slate-300 border-slate-700';

  const dateFormatted = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="group relative flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 hover:bg-slate-900/90 transition-all duration-200 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
          {article.category}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span>❤️</span> {article.likes_count ?? 0}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
        <Link href={`/articles/${article.id}`}>
          <span className="absolute inset-0" />
          {article.title}
        </Link>
      </h3>

      <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
        {article.summary}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 text-[10px]">
            {article.author_name ? article.author_name[0] : 'U'}
          </span>
          <span className="font-medium text-slate-300">{article.author_name}</span>
        </div>
        <time dateTime={article.created_at}>{dateFormatted}</time>
      </div>
    </article>
  );
}
