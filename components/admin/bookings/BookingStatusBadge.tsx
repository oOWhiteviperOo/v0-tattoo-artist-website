import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import { differenceInHours } from 'date-fns'
import type { BookingState } from '@/lib/google-sheets/types'

const STATUS_STYLES: Record<BookingState, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  pending_deposit: { variant: 'outline', className: 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' },
  deposit_paid: { variant: 'outline', className: 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' },
  confirmed: { variant: 'outline', className: 'border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 dark:border-green-800' },
  cancelled: { variant: 'outline', className: 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 dark:border-red-800' },
  expired: { variant: 'outline', className: 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700' },
}

const STATUS_LABELS: Record<BookingState, string> = {
  pending_deposit: 'Pending Deposit',
  deposit_paid: 'Deposit Paid',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  expired: 'Expired',
}

interface BookingStatusBadgeProps {
  status: BookingState
  createdAt?: string
}

export function BookingStatusBadge({ status, createdAt }: BookingStatusBadgeProps) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.expired
  const isStale = status === 'pending_deposit' && createdAt && isOlderThan24Hours(createdAt)

  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge variant={style.variant} className={style.className}>
        {STATUS_LABELS[status] || status}
      </Badge>
      {isStale && (
        <span title="Stale: pending for over 24 hours">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        </span>
      )}
    </span>
  )
}

function isOlderThan24Hours(dateStr: string): boolean {
  try {
    return differenceInHours(new Date(), new Date(dateStr)) > 24
  } catch {
    return false
  }
}
