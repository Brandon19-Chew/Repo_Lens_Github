const Shimmer = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-secondary/60 rounded ${className}`} />
);

const AnalysisSkeleton = () => (
  <div className="space-y-4">
    {/* Repo card skeleton */}
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex gap-4">
        <Shimmer className="w-12 h-12 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-5 w-48" />
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <Shimmer key={i} className="h-14 rounded-lg" />)}
      </div>
    </div>

    {/* Language chart skeleton */}
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <Shimmer className="h-4 w-36" />
      <Shimmer className="h-3 w-full rounded-full" />
      <div className="grid grid-cols-2 gap-2">
        {[1,2,3,4].map(i => <Shimmer key={i} className="h-5" />)}
      </div>
    </div>

    {/* Two column skeletons */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <Shimmer className="h-4 w-32" />
        {[1,2,3,4,5].map(i => <Shimmer key={i} className="h-10 rounded" />)}
      </div>
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <Shimmer className="h-4 w-40" />
        {[1,2,3,4,5].map(i => <Shimmer key={i} className="h-10 rounded" />)}
      </div>
    </div>
  </div>
);

export default AnalysisSkeleton;
