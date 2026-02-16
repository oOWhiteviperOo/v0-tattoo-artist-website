import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { getStudioById, updateStudio } from '@/lib/google-sheets/studios'
import { getBookingsByStudio } from '@/lib/google-sheets/bookings'
import { getAllReminders } from '@/lib/google-sheets/reminders'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ studioId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { studioId } = await params
    const [studio, bookings, allReminders] = await Promise.all([
      getStudioById(studioId),
      getBookingsByStudio(studioId),
      getAllReminders(),
    ])

    if (!studio) {
      return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
    }

    const bookingIds = new Set(bookings.map(b => b.bookingId))
    const reminders = allReminders.filter(r => bookingIds.has(r.bookingId))

    return NextResponse.json({ studio, bookings, reminders })
  } catch (error) {
    console.error('Failed to fetch studio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch studio' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ studioId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { studioId } = await params
    const updates = await request.json()

    await updateStudio(studioId, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update studio:', error)
    return NextResponse.json(
      { error: 'Failed to update studio' },
      { status: 500 }
    )
  }
}
