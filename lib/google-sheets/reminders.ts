import { sheetsProxy } from './client'
import type { ReminderRow } from './types'

interface ProxyResponse {
  data: ReminderRow[]
}

export async function getAllReminders(): Promise<ReminderRow[]> {
  const response = await sheetsProxy<ProxyResponse>('reminders')
  return response.data || []
}

export async function getRemindersByBooking(bookingId: string): Promise<ReminderRow[]> {
  const allReminders = await getAllReminders()
  return allReminders.filter(r => r.bookingId === bookingId)
}
