import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { CalendarDays, CreditCard, AlertTriangle } from 'lucide-react'
import type { BookingRow } from '@/lib/google-sheets/types'

interface ActivityFeedProps {
  bookings: BookingRow[]
}

export function ActivityFeed({ bookings }: ActivityFeedProps) {
  const recentActivity = bookings
    .filter(b => b.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((booking) => (
              <ActivityItem key={booking.bookingId} booking={booking} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityItem({ booking }: { booking: BookingRow }) {
  const icon = getActivityIcon(booking)
  const message = getActivityMessage(booking)
  const time = booking.createdAt
    ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })
    : ''

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-full bg-muted p-1.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

function getActivityIcon(booking: BookingRow) {
  if (booking.escalationReason) {
    return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
  }
  if (booking.state === 'deposit_paid' || booking.state === 'confirmed') {
    return <CreditCard className="h-3.5 w-3.5 text-green-500" />
  }
  return <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
}

function getActivityMessage(booking: BookingRow) {
  const name = booking.clientName || 'Unknown client'
  const studio = booking.studioId || 'unknown studio'

  if (booking.escalationReason) {
    return `${name} escalated at ${studio}`
  }
  if (booking.state === 'confirmed') {
    return `${name} confirmed at ${studio}`
  }
  if (booking.state === 'deposit_paid') {
    return `${name} paid deposit at ${studio} (£${booking.depositAmount})`
  }
  return `${name} new booking at ${studio}`
}
