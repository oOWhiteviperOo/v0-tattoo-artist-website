import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { getAllStudios } from '@/lib/google-sheets/studios'
import { getAllBookings } from '@/lib/google-sheets/bookings'
import type { StudioWithStats } from '@/lib/google-sheets/types'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [studios, bookings] = await Promise.all([
      getAllStudios(),
      getAllBookings(),
    ])

    const studiosWithStats: StudioWithStats[] = studios.map(studio => {
      const studioBookings = bookings.filter(b => b.studioId === studio.studioId)
      const revenue = studioBookings
        .filter(b => b.state === 'deposit_paid' || b.state === 'confirmed')
        .reduce((sum, b) => sum + b.depositAmount, 0)

      return {
        ...studio,
        bookingCount: studioBookings.length,
        revenue,
      }
    })

    return NextResponse.json({ studios: studiosWithStats })
  } catch (error) {
    console.error('Failed to fetch studios:', error)
    return NextResponse.json(
      { error: 'Failed to fetch studios' },
      { status: 500 }
    )
  }
}
