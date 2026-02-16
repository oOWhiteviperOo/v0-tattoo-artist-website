'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { BookingStatusBadge } from './BookingStatusBadge'
import { format } from 'date-fns'
import type { BookingRow } from '@/lib/google-sheets/types'

interface BookingDetailDrawerProps {
  booking: BookingRow | null
  open: boolean
  onClose: () => void
}

export function BookingDetailDrawer({ booking, open, onClose }: BookingDetailDrawerProps) {
  if (!booking) return null

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{booking.clientName || 'Booking Detail'}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}
          <div>
            <BookingStatusBadge status={booking.state} createdAt={booking.createdAt} />
          </div>

          {/* Client Info */}
          <Section title="Client">
            <Field label="Name" value={booking.clientName} />
            <Field label="Email" value={booking.clientEmail} />
            <Field label="Phone" value={booking.clientPhone} />
            <Field label="Channel" value={booking.channel} />
            <Field label="Age Confirmed" value={booking.ageConfirmed ? 'Yes' : 'No'} />
          </Section>

          {/* Appointment */}
          <Section title="Appointment">
            <Field label="Type" value={booking.appointmentType} />
            <Field label="Style" value={booking.style} />
            <Field label="Placement" value={booking.placement} />
            <Field label="Size" value={booking.sizeDescription} />
            <Field label="Date" value={formatDate(booking.appointmentDate)} />
            <Field label="Time" value={`${booking.appointmentStart || '—'} – ${booking.appointmentEnd || '—'}`} />
            <Field label="Duration" value={booking.durationMinutes ? `${booking.durationMinutes} min` : '—'} />
            <Field label="Artist" value={booking.artistName} />
            <Field label="Budget" value={booking.budgetMin || booking.budgetMax ? `£${booking.budgetMin}–£${booking.budgetMax}` : '—'} />
          </Section>

          {/* Payment */}
          <Section title="Payment">
            <Field label="Deposit" value={booking.depositAmount ? `£${booking.depositAmount} ${booking.depositCurrency}` : '—'} />
            <Field label="Paid At" value={formatDate(booking.depositPaidAt)} />
            <Field label="Stripe Session" value={booking.stripeSessionId || '—'} />
          </Section>

          {/* Meta */}
          <Section title="Meta">
            <Field label="Booking ID" value={booking.bookingId} />
            <Field label="Studio" value={booking.studioId} />
            <Field label="Intent" value={booking.intent} />
            <Field label="Created" value={formatDate(booking.createdAt)} />
            <Field label="Updated" value={formatDate(booking.updatedAt)} />
            {booking.escalationReason && (
              <Field label="Escalation" value={booking.escalationReason} />
            )}
          </Section>

          {/* Execution Log */}
          {booking.executionLog && (
            <Section title="Execution Log">
              <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto max-h-[200px]">
                {formatJson(booking.executionLog)}
              </pre>
            </Section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <Separator className="mb-3" />
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right break-all">{value || '—'}</span>
    </div>
  )
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  try {
    return format(new Date(dateStr), 'dd MMM yyyy HH:mm')
  } catch {
    return dateStr
  }
}

function formatJson(jsonStr: string): string {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2)
  } catch {
    return jsonStr
  }
}
