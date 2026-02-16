import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { getAllBookings } from '@/lib/google-sheets/bookings'
import type { BookingRow } from '@/lib/google-sheets/types'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const studioId = searchParams.get('studioId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    let bookings: BookingRow[] = await getAllBookings()

    if (studioId) {
      bookings = bookings.filter(b => b.studioId === studioId)
    }
    if (status) {
      bookings = bookings.filter(b => b.state === status)
    }
    if (search) {
      const q = search.toLowerCase()
      bookings = bookings.filter(
        b =>
          b.clientName.toLowerCase().includes(q) ||
          b.clientEmail.toLowerCase().includes(q)
      )
    }
    if (dateFrom) {
      const from = new Date(dateFrom)
      bookings = bookings.filter(b => b.createdAt && new Date(b.createdAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      bookings = bookings.filter(b => b.createdAt && new Date(b.createdAt) <= to)
    }

    // Sort newest first
    bookings.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
