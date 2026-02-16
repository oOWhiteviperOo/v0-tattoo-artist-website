import { Skeleton } from '@/components/ui/skeleton'

export default function StudiosLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56 mt-2" />
      </div>
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-[400px] rounded-md" />
    </div>
  )
}
