import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// --- Types ---

interface ActivityEvent {
  timestamp: string
  studioId: string
  eventType: string
  clientFirstName: string
  outcome: string
  metadata: string
}

interface ActivitySummary {
  totalActions: number
  depositsCollected: number
  estimatedHoursSaved: number
  last7days: number
}

interface PageProps {
  params: Promise<{ studioSlug: string }>
}

// --- Config ---

const N8N_BASE = process.env.N8N_BASE_URL || 'https://n8n.apexaisystems.co.uk'

const MINUTES_SAVED: Record<string, number> = {
  booking_confirmed: 15,
  deposit_received: 0,
  new_inquiry: 5,
  inquiry_classified: 5,
  cancellation_completed: 10,
  cancellation_processed: 10,
  reschedule_completed: 10,
  reminder_sent: 3,
  faq_answered: 5,
  escalation_triggered: 0,
}

const EVENT_LABELS: Record<string, string> = {
  booking_confirmed: 'Booking confirmed',
  deposit_received: 'Deposit received',
  new_inquiry: 'Inquiry handled',
  inquiry_classified: 'Inquiry handled',
  cancellation_completed: 'Cancellation processed',
  cancellation_processed: 'Cancellation processed',
  reschedule_completed: 'Rescheduled',
  reminder_sent: 'Reminder sent',
  faq_answered: 'FAQ answered',
  escalation_triggered: 'Escalated to team',
}

const AMBER_EVENTS = new Set([
  'booking_confirmed',
  'deposit_received',
  'new_inquiry',
  'inquiry_classified',
  'reschedule_completed',
  'cancellation_completed',
  'escalation_triggered',
])

// --- Data Fetching ---

async function getStudioData(studioSlug: string) {
  try {
    const url = `${N8N_BASE}/webhook/studio-data?action=getStudio&studioSlug=${encodeURIComponent(studioSlug)}`
    const resp = await fetch(url, { next: { revalidate: 3600 } })
    if (!resp.ok) return null
    const data = await resp.json()
    if (!data.found) return null
    return {
      studioName: data.studioName || '',
      activityFeedEnabled: data.activityFeedEnabled || 'FALSE',
      workingHours: data.workingHours || '09:00-18:00',
    }
  } catch {
    return null
  }
}

async function getActivityData(studioSlug: string): Promise<{
  events: ActivityEvent[]
  summary: ActivitySummary
} | null> {
  try {
    const url = `${N8N_BASE}/webhook/studio-data?action=getActivity&studioSlug=${encodeURIComponent(studioSlug)}&limit=100`
    const resp = await fetch(url, { next: { revalidate: 60 } })
    if (!resp.ok) return null
    const data = await resp.json()
    if (!data.found) return null
    return {
      events: data.activities || [],
      summary: data.summary || { totalActions: 0, depositsCollected: 0, estimatedHoursSaved: 0, last7days: 0 },
    }
  } catch {
    return null
  }
}

// --- Helpers ---

function isAfterHours(timestamp: string, workingHours: string): boolean {
  try {
    const [start, end] = workingHours.split('-')
    const [startH, startM] = start.split(':').map(Number)
    const [endH, endM] = end.split(':').map(Number)
    const d = new Date(timestamp)
    const mins = d.getUTCHours() * 60 + d.getUTCMinutes()
    const startMins = startH * 60 + startM
    const endMins = endH * 60 + endM
    return mins < startMins || mins >= endMins
  } catch {
    return false
  }
}

function formatTime(timestamp: string): string {
  try {
    const d = new Date(timestamp)
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/London' })
  } catch {
    return '--:--'
  }
}

function getDayLabel(dateStr: string): string {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10)

  if (dateStr === today) return 'Today'
  if (dateStr === yesterday) return 'Yesterday'

  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
}

function groupByDay(events: ActivityEvent[]): Map<string, ActivityEvent[]> {
  const groups = new Map<string, ActivityEvent[]>()
  const sorted = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  for (const event of sorted) {
    const day = event.timestamp.slice(0, 10)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(event)
  }
  return groups
}

function computeSummary(events: ActivityEvent[]): { actions: number; deposits: number; hours: number } {
  let deposits = 0
  let totalMinutes = 0
  for (const e of events) {
    totalMinutes += MINUTES_SAVED[e.eventType] || 0
    if (e.eventType === 'deposit_received' || e.eventType === 'booking_confirmed') {
      try {
        const meta = JSON.parse(e.metadata || '{}')
        const dep = parseFloat(meta.deposit || meta.amount || '0')
        if (dep > 0) deposits += dep
      } catch { /* ignore */ }
    }
  }
  return { actions: events.length, deposits, hours: Math.round(totalMinutes / 60) }
}

function getEventDetail(event: ActivityEvent): string {
  const parts: string[] = []
  if (event.clientFirstName) parts.push(event.clientFirstName)

  try {
    const meta = JSON.parse(event.metadata || '{}')
    if (event.eventType === 'booking_confirmed') {
      if (meta.artistName) parts.push(`with ${meta.artistName}`)
      if (meta.deposit && parseFloat(meta.deposit) > 0) parts.push(`\u00a3${meta.deposit} deposit`)
    } else if (event.eventType === 'deposit_received') {
      if (meta.amount && parseFloat(meta.amount) > 0) parts.push(`\u00a3${meta.amount}`)
    } else if (event.eventType === 'cancellation_processed' || event.eventType === 'reschedule_completed') {
      if (meta.appointmentDate) parts.push(meta.appointmentDate)
    }
  } catch { /* ignore */ }

  if (!parts.length && event.outcome) parts.push(event.outcome)
  return parts.join(' \u00b7 ')
}

// --- Metadata ---

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { studioSlug } = await params
  const studio = await getStudioData(studioSlug)
  if (!studio || studio.activityFeedEnabled !== 'TRUE') {
    return { title: 'Not Found' }
  }
  return {
    title: `${studio.studioName} | Activity Feed`,
    description: `Live activity feed for ${studio.studioName}, powered by Apex Influence.`,
    openGraph: {
      title: `${studio.studioName} | Activity Feed`,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Apex Influence',
    },
  }
}

// --- Page ---

export default async function ActivityFeedPage({ params }: PageProps) {
  const { studioSlug } = await params
  const studio = await getStudioData(studioSlug)

  if (!studio || studio.activityFeedEnabled !== 'TRUE') notFound()

  const activityData = await getActivityData(studioSlug)

  // Error state — proxy unavailable
  if (!activityData) {
    return (
      <div className="min-h-screen px-4 py-8" style={{ background: '#0a0a0a' }}>
        <div className="max-w-md mx-auto">
          <div className="rounded-xl overflow-hidden" style={{ background: '#111827' }}>
            <div className="px-6 py-10 text-center">
              <h1 className="font-display text-xl font-bold" style={{ color: '#f9fafb' }}>
                {studio.studioName}
              </h1>
              <p className="mt-4 text-sm" style={{ color: '#6b7280' }}>
                Temporarily unavailable
              </p>
              <p className="mt-2 text-xs" style={{ color: '#4b5563' }}>
                Try refreshing in a moment
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { events } = activityData
  const summary = computeSummary(events)
  const dayGroups = groupByDay(events)

  // Empty state — no activity yet
  if (events.length === 0) {
    return (
      <div className="min-h-screen px-4 py-8" style={{ background: '#0a0a0a' }}>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="rounded-xl overflow-hidden mb-3" style={{ background: '#111827' }}>
            <div className="px-6 py-8 text-center">
              <h1 className="font-display text-2xl font-bold" style={{ color: '#f9fafb' }}>
                {studio.studioName}
              </h1>
              <p className="mt-1 text-xs uppercase" style={{ color: '#6b7280', letterSpacing: '0.15em' }}>
                Activity Feed
              </p>
            </div>
          </div>
          {/* Empty card */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#111827' }}>
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex items-center justify-center">
                <span
                  className="block w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.4)' }}
                />
              </div>
              <p className="text-sm" style={{ color: '#6b7280' }}>No activity yet</p>
              <p className="mt-1 text-xs" style={{ color: '#4b5563' }}>Apex is ready and waiting</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: '#0a0a0a' }}>
      <div className="max-w-md mx-auto">

        {/* Header Card */}
        <div className="rounded-xl overflow-hidden mb-3" style={{ background: '#111827' }}>
          <div className="px-6 pt-8 pb-2 text-center">
            <h1 className="font-display text-2xl font-bold" style={{ color: '#f9fafb' }}>
              {studio.studioName}
            </h1>
            <p className="mt-1 text-xs uppercase" style={{ color: '#6b7280', letterSpacing: '0.15em' }}>
              Activity Feed
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 px-6 py-5">
            <div className="text-center">
              <p className="font-display text-2xl font-bold" style={{ color: '#f59e0b' }}>
                {summary.actions}
              </p>
              <p className="mt-1 text-[10px] uppercase" style={{ color: '#6b7280', letterSpacing: '0.08em' }}>
                actions
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold" style={{ color: '#f59e0b' }}>
                {summary.deposits > 0 ? `\u00a3${summary.deposits.toLocaleString('en-GB')}` : '\u00a30'}
              </p>
              <p className="mt-1 text-[10px] uppercase" style={{ color: '#6b7280', letterSpacing: '0.08em' }}>
                deposits
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold" style={{ color: '#f59e0b' }}>
                ~{summary.hours}h
              </p>
              <p className="mt-1 text-[10px] uppercase" style={{ color: '#6b7280', letterSpacing: '0.08em' }}>
                saved
              </p>
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="h-px" style={{ background: '#1f2937' }} />
            <p className="mt-3 text-center text-xs" style={{ color: '#6b7280' }}>
              Last 30 days
            </p>
          </div>
        </div>

        {/* Day Groups */}
        {Array.from(dayGroups.entries()).map(([day, dayEvents]) => (
          <div key={day} className="rounded-xl overflow-hidden mb-3" style={{ background: '#111827' }}>
            {/* Day Label */}
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-display text-sm font-bold uppercase" style={{ color: '#6b7280', letterSpacing: '0.1em' }}>
                {getDayLabel(day)}
              </h2>
              <div className="mt-2 h-px" style={{ background: '#1f2937' }} />
            </div>

            {/* Events */}
            <div className="px-5 pb-4 space-y-4">
              {dayEvents.map((event, i) => {
                const isAmber = AMBER_EVENTS.has(event.eventType)
                const afterHours = isAfterHours(event.timestamp, studio.workingHours)
                const detail = getEventDetail(event)

                return (
                  <div key={`${day}-${i}`} className="flex gap-3">
                    {/* Dot */}
                    <div className="flex-shrink-0 pt-1">
                      <span
                        className="block w-2 h-2 rounded-full"
                        style={{
                          background: isAmber ? '#f59e0b' : '#4b5563',
                          boxShadow: isAmber ? '0 0 6px rgba(245,158,11,0.3)' : 'none',
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs tabular-nums" style={{ color: '#6b7280' }}>
                          {formatTime(event.timestamp)}
                        </span>
                        <span className="text-sm font-medium" style={{ color: '#f9fafb' }}>
                          {EVENT_LABELS[event.eventType] || event.eventType}
                        </span>
                      </div>

                      {detail && (
                        <p className="mt-0.5 text-xs" style={{ color: '#d1d5db' }}>
                          {detail}
                        </p>
                      )}

                      {afterHours && (
                        <span
                          className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
                        >
                          handled while you were off
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Footer Card */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#111827' }}>
          <div className="px-6 py-4 text-center">
            <p className="text-xs" style={{ color: '#6b7280' }}>
              Powered by{' '}
              <a
                href="https://www.apexaisystems.co.uk"
                style={{ color: '#f59e0b' }}
                className="hover:underline"
              >
                Apex Influence
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
