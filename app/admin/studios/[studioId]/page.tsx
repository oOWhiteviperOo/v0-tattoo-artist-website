'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/admin/shared/DataTable'
import { StudioForm } from '@/components/admin/studios/StudioForm'
import { ArrowLeft, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import type { StudioRow, BookingRow, ReminderRow, BookingState } from '@/lib/google-sheets/types'
import type { ColumnDef } from '@tanstack/react-table'

const STATUS_COLORS: Record<BookingState, string> = {
  pending_deposit: 'bg-amber-500/10 text-amber-600 border-amber-200',
  deposit_paid: 'bg-blue-500/10 text-blue-600 border-blue-200',
  confirmed: 'bg-green-500/10 text-green-600 border-green-200',
  cancelled: 'bg-red-500/10 text-red-600 border-red-200',
  expired: 'bg-gray-500/10 text-gray-600 border-gray-200',
}

const bookingColumns: ColumnDef<BookingRow>[] = [
  {
    accessorKey: 'clientName',
    header: 'Client',
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ row }) => {
      const state = row.original.state
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${STATUS_COLORS[state] || ''}`}>
          {state.replace('_', ' ')}
        </span>
      )
    },
  },
  {
    accessorKey: 'appointmentDate',
    header: 'Appointment',
    cell: ({ row }) => {
      const date = row.original.appointmentDate
      try {
        return date ? format(new Date(date), 'dd MMM yyyy') : '—'
      } catch {
        return date || '—'
      }
    },
  },
  {
    accessorKey: 'depositAmount',
    header: 'Deposit',
    cell: ({ row }) => `£${row.original.depositAmount || 0}`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.createdAt
      try {
        return date ? format(new Date(date), 'dd MMM yyyy') : '—'
      } catch {
        return date || '—'
      }
    },
  },
]

interface StudioData {
  studio: StudioRow
  bookings: BookingRow[]
  reminders: ReminderRow[]
}

export default function StudioDetailPage() {
  const params = useParams<{ studioId: string }>()
  const router = useRouter()
  const [data, setData] = useState<StudioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const fetchData = () => {
    setLoading(true)
    fetch(`/api/admin/studios/${params.studioId}`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [params.studioId])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    )
  }

  const { studio, bookings, reminders } = data

  const upcoming = bookings.filter(b =>
    b.appointmentDate && new Date(b.appointmentDate) >= new Date() &&
    (b.state === 'confirmed' || b.state === 'deposit_paid')
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/studios')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{studio.studioName}</h1>
            <Badge variant={studio.active ? 'default' : 'secondary'}>
              {studio.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{studio.studioAddress}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
          <Pencil className="h-4 w-4 mr-2" />
          {editing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {editing ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Edit Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <StudioForm studio={studio} onSaved={() => { setEditing(false); fetchData() }} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold">{upcoming.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Deposit Rate</p>
              <p className="text-2xl font-bold">{studio.depositPercent}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Reminders</p>
              <p className="text-2xl font-bold">{reminders.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={bookingColumns} data={bookings} searchKey="clientName" searchPlaceholder="Search bookings..." />
        </CardContent>
      </Card>
    </div>
  )
}
