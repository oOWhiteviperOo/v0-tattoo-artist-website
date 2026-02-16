import { sheetsProxy } from './client'
import type { BookingRow } from './types'

interface ProxyResponse {
  data: BookingRow[]
}

export async function getAllBookings(): Promise<BookingRow[]> {
  const response = await sheetsProxy<ProxyResponse>('bookings')
  return response.data || []
}

export async function getBookingsByStudio(studioId: string): Promise<BookingRow[]> {
  const allBookings = await getAllBookings()
  return allBookings.filter(b => b.studioId === studioId)
}

export async function getBookingById(bookingId: string): Promise<BookingRow | null> {
  const allBookings = await getAllBookings()
  return allBookings.find(b => b.bookingId === bookingId) || null
}
