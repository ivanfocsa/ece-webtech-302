export default function ArticleSkeleton() {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 animate-pulse flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-16 bg-slate-800 rounded-full" />
        <div className="h-4 w-8 bg-slate-800 rounded" />
      </div>
      <div className="h-5 w-3/4 bg-slate-800 rounded mb-2" />
      <div className="h-5 w-1/2 bg-slate-800 rounded mb-4" />
      <div className="space-y-2 mb-4 flex-1">
        <div className="h-3 w-full bg-slate-800/70 rounded" />
        <div className="h-3 w-5/6 bg-slate-800/70 rounded" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-4 w-16 bg-slate-800 rounded" />
      </div>
    </div>
  );
}
