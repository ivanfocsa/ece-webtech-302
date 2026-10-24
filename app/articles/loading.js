import ArticleSkeleton from '@/components/ArticleSkeleton';

export default function ArticlesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="h-4 w-28 bg-slate-800 rounded" />
        <div className="h-8 w-64 bg-slate-800 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
