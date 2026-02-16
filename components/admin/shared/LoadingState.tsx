import { Skeleton } from '@/components/ui/skeleton'

interface LoadingStateProps {
  variant?: 'cards' | 'table' | 'detail'
}

export function LoadingState({ variant = 'cards' }: LoadingStateProps) {
  if (variant === 'table') {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] rounded-md" />
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    )
  }

  // cards variant
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[108px] rounded-xl" />
      ))}
    </div>
  )
}
