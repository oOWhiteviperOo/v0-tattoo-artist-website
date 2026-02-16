'use client'

import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { useStudios } from '@/lib/admin/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import type { StudioWithStats } from '@/lib/google-sheets/types'

const columns: ColumnDef<StudioWithStats>[] = [
  {
    accessorKey: 'studioName',
    header: 'Studio',
  },
  {
    accessorKey: 'artistNames',
    header: 'Artists',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.artistNames || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.active ? 'default' : 'secondary'}>
        {row.original.active ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'bookingCount',
    header: 'Bookings',
    cell: ({ row }) => row.original.bookingCount,
  },
  {
    accessorKey: 'revenue',
    header: 'Revenue',
    cell: ({ row }) => `£${row.original.revenue.toLocaleString('en-GB')}`,
  },
]

export default function StudiosPage() {
  const router = useRouter()
  const { data, isLoading } = useStudios()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  const studios = data?.studios || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Studios</h1>
        <p className="text-muted-foreground text-sm">
          Manage your tattoo studio clients
        </p>
      </div>

      <DataTable
        columns={columns}
        data={studios}
        searchKey="studioName"
        searchPlaceholder="Search studios..."
        onRowClick={(studio) => router.push(`/admin/studios/${studio.studioId}`)}
      />
    </div>
  )
}
