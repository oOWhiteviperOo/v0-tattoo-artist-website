'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/shared/DataTable'
import { BookingStatusBadge } from '@/components/admin/bookings/BookingStatusBadge'
import { BookingFilters } from '@/components/admin/bookings/BookingFilters'
import { BookingDetailDrawer } from '@/components/admin/bookings/BookingDetailDrawer'
import { useBookings, useStudios } from '@/lib/admin/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import type { BookingRow } from '@/lib/google-sheets/types'

const columns: ColumnDef<BookingRow>[] = [
  {
    accessorKey: 'clientName',
    header: 'Client',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.clientName || '—'}</p>
        <p className="text-xs text-muted-foreground">{row.original.clientEmail}</p>
      </div>
    ),
  },
  {
    accessorKey: 'studioId',
    header: 'Studio',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.studioId}</span>
    ),
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ row }) => (
      <BookingStatusBadge status={row.original.state} createdAt={row.original.createdAt} />
    ),
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
    cell: ({ row }) => {
      const amount = row.original.depositAmount
      return amount ? `£${amount}` : '—'
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.createdAt
      try {
        return date ? format(new Date(date), 'dd MMM HH:mm') : '—'
      } catch {
        return date || '—'
      }
    },
  },
]

export default function BookingsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null)

  const { data: bookingsData, isLoading: bookingsLoading } = useBookings(filters)
  const { data: studiosData } = useStudios()

  const bookings = bookingsData?.bookings || []
  const studios = (studiosData?.studios || []).map(s => ({
    studioId: s.studioId,
    studioName: s.studioName,
  }))

  if (bookingsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-52 mt-2" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[500px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-muted-foreground text-sm">
          All bookings across all studios
        </p>
      </div>

      <BookingFilters
        filters={filters}
        onFiltersChange={setFilters}
        studios={studios}
      />

      <DataTable
        columns={columns}
        data={bookings}
        onRowClick={(booking) => setSelectedBooking(booking)}
      />

      <BookingDetailDrawer
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  )
}
