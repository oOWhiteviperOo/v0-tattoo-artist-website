'use client'

import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface BookingFiltersProps {
  filters: Record<string, string>
  onFiltersChange: (filters: Record<string, string>) => void
  studios?: Array<{ studioId: string; studioName: string }>
}

export function BookingFilters({ filters, onFiltersChange, studios = [] }: BookingFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '')

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput })
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const updateFilter = useCallback(
    (key: string, value: string) => {
      onFiltersChange({ ...filters, [key]: value === 'all' ? '' : value })
    },
    [filters, onFiltersChange]
  )

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      {studios.length > 0 && (
        <Select
          value={filters.studioId || 'all'}
          onValueChange={(v) => updateFilter('studioId', v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Studios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Studios</SelectItem>
            {studios.map((s) => (
              <SelectItem key={s.studioId} value={s.studioId}>
                {s.studioName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={filters.status || 'all'}
        onValueChange={(v) => updateFilter('status', v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending_deposit">Pending Deposit</SelectItem>
          <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        placeholder="From"
        value={filters.dateFrom || ''}
        onChange={(e) => updateFilter('dateFrom', e.target.value)}
        className="w-[160px]"
      />
      <Input
        type="date"
        placeholder="To"
        value={filters.dateTo || ''}
        onChange={(e) => updateFilter('dateTo', e.target.value)}
        className="w-[160px]"
      />
    </div>
  )
}
