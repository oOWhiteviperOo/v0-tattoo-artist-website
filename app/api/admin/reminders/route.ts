import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { getAllReminders, getRemindersByBooking } from '@/lib/google-sheets/reminders'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')

    const reminders = bookingId
      ? await getRemindersByBooking(bookingId)
      : await getAllReminders()

    return NextResponse.json({ reminders })
  } catch (error) {
    console.error('Failed to fetch reminders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}
