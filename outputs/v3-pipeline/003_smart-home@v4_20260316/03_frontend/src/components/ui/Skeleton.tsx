interface SkeletonProps {
  className?: string
  rounded?: string
}

export function Skeleton({ className = '', rounded = 'rounded-xl' }: SkeletonProps) {
  return (
    <div className={`skeleton ${rounded} ${className}`} />
  )
}

export function DeviceCardSkeleton() {
  return (
    <div className="glass rounded-card p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-card p-5">
      <Skeleton className="h-3 w-20 rounded-md mb-3" />
      <Skeleton className="h-10 w-28 rounded-md mb-2" />
      <Skeleton className="h-3 w-16 rounded-md" />
    </div>
  )
}
