'use client'

import useSWR from 'swr'
import type { StudioWithStats, BookingRow, ReminderRow } from '@/lib/google-sheets/types'
import type { WorkflowWithStats } from '@/lib/n8n/types'

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error(`API error: ${r.status}`)
  return r.json()
})

export function useStudios() {
  return useSWR<{ studios: StudioWithStats[] }>(
    '/api/admin/studios',
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  )
}

export function useBookings(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v)
  ).toString()
  const url = `/api/admin/bookings${params ? `?${params}` : ''}`

  return useSWR<{ bookings: BookingRow[] }>(
    url,
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  )
}

export function useWorkflows() {
  return useSWR<{ workflows: WorkflowWithStats[] }>(
    '/api/admin/workflows',
    fetcher,
    { refreshInterval: 60000, revalidateOnFocus: true }
  )
}

export function useReminders(bookingId?: string) {
  const url = bookingId
    ? `/api/admin/reminders?bookingId=${bookingId}`
    : '/api/admin/reminders'

  return useSWR<{ reminders: ReminderRow[] }>(
    url,
    fetcher,
    { refreshInterval: 30000 }
  )
}
