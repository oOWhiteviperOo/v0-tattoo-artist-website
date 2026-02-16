// Google Sheets row types — maps to columns defined in workflows/SHEETS_SCHEMA.md

export type BookingState =
  | 'pending_deposit'
  | 'deposit_paid'
  | 'confirmed'
  | 'cancelled'
  | 'expired'

// Bookings Sheet (columns A-AH, 34 fields)
export interface BookingRow {
  bookingId: string           // A - UUID
  studioId: string            // B
  state: BookingState         // C
  clientName: string          // D
  clientEmail: string         // E
  clientPhone: string         // F - UK E.164
  ageConfirmed: boolean       // G
  channel: string             // H - web_chat | sms | email | instagram_dm
  intent: string              // I - book | reschedule | cancel | faq | escalate
  appointmentType: string     // J
  style: string               // K
  placement: string           // L
  sizeDescription: string     // M
  budgetMin: number           // N
  budgetMax: number           // O
  referenceImageUrls: string  // P
  additionalNotes: string     // Q
  artistId: string            // R
  artistName: string          // S
  appointmentDate: string     // T - ISO date
  appointmentStart: string    // U
  appointmentEnd: string      // V
  durationMinutes: number     // W
  calendarEventId: string     // X
  depositAmount: number       // Y
  depositCurrency: string     // Z - GBP
  stripeSessionId: string     // AA
  stripePaymentIntentId: string // AB
  depositPaidAt: string       // AC
  requestHash: string         // AD - SHA-256 dedup
  createdAt: string           // AE - ISO datetime
  updatedAt: string           // AF
  escalationReason: string    // AG
  executionLog: string        // AH - JSON string
}

// Studios Sheet (columns A-P, 16 fields)
export interface StudioRow {
  studioId: string                // A
  studioName: string              // B
  studioAddress: string           // C
  studioPhone: string             // D
  studioEmail: string             // E
  artistNames: string             // F - comma-separated
  calendarId: string              // G
  depositPercent: number          // H
  depositMinGBP: number           // I
  cancellationWindowHours: number // J
  sessionTypes: string            // K - JSON array
  reminderChannels: string        // L
  escalationWebhook: string       // M
  escalationPhone: string         // N
  bookingPageUrl: string          // O
  active: boolean                 // P
}

// Reminders Sheet (columns A-N, 14 fields)
export interface ReminderRow {
  reminderId: string          // A
  bookingId: string           // B
  clientName: string          // C
  clientEmail: string         // D
  clientPhone: string         // E
  sendAt: string              // F - ISO datetime
  channel: string             // G
  templateId: string          // H
  status: string              // I
  appointmentDatetime: string // J
  artistName: string          // K
  studioAddress: string       // L
  sentAt: string              // M
  failureReason: string       // N
}

// Enriched studio with computed stats (for list view)
export interface StudioWithStats extends StudioRow {
  bookingCount: number
  revenue: number
}
