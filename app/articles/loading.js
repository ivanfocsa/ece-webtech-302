import ArticleSkeleton from '@/components/ArticleSkeleton';

export default function ArticlesLoading() {
  return (
    <div className="page grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ArticleSkeleton key={i} />
      ))}
    </div>
  );
}
