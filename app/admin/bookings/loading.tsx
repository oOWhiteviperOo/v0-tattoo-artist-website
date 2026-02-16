import { Skeleton } from '@/components/ui/skeleton'

export default function BookingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-52 mt-2" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <Skeleton className="h-[500px] rounded-md" />
    </div>
  )
}
