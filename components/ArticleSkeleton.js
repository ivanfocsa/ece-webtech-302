export default function ArticleSkeleton() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 animate-pulse flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-16 bg-zinc-900 rounded" />
        <div className="h-4 w-8 bg-zinc-900 rounded" />
      </div>
      <div className="h-5 w-3/4 bg-zinc-900 rounded mb-2" />
      <div className="h-5 w-1/2 bg-zinc-900 rounded mb-4" />
      <div className="space-y-2 mb-4 flex-1">
        <div className="h-3 w-full bg-zinc-900/70 rounded" />
        <div className="h-3 w-5/6 bg-zinc-900/70 rounded" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
        <div className="h-4 w-24 bg-zinc-900 rounded" />
        <div className="h-4 w-16 bg-zinc-900 rounded" />
      </div>
    </div>
  );
}
