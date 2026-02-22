import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface ReportMetrics {
    inquiriesHandled: number
    bookingsCreated: number
    depositsCollected: number
    remindersSent: number
    noShowsPrevented: number
    avgResponseTimeSec: number
    calendarUtilisationPct: number
}

interface PageProps {
    params: Promise<{ studioSlug: string; period: string }>
}

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
const BOOKINGS_SHEET_ID = '12F1Wfe5SjdSNUhqoZE1I4ySg21S1aE2sS6hLIp7yzao'

function formatMonth(period: string): string {
    const [y, m] = period.split('-')
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ]
    return `${months[parseInt(m) - 1]} ${y}`
}

async function getStudioData(studioSlug: string) {
    try {
        const url = `${SHEETS_BASE}/${BOOKINGS_SHEET_ID}/values/Studios!A:R?key=${process.env.GOOGLE_SHEETS_API_KEY}`
        const resp = await fetch(url, { next: { revalidate: 3600 } })
        if (!resp.ok) return null

        const data = await resp.json()
        const rows = data.values || []
        if (rows.length < 2) return null

        const headers = rows[0] as string[]
        const idIdx = headers.indexOf('studioId')
        const nameIdx = headers.indexOf('studioName')
        const shareIdx = headers.indexOf('shareableOptIn')

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i] as string[]
            if (row[idIdx] === studioSlug) {
                return {
                    studioId: row[idIdx] || '',
                    studioName: row[nameIdx] || '',
                    shareableOptIn: row[shareIdx] || 'FALSE',
                }
            }
        }
        return null
    } catch {
        return null
    }
}

async function getReportMetrics(
    studioSlug: string,
    period: string
): Promise<ReportMetrics | null> {
    try {
        const url = `${SHEETS_BASE}/${BOOKINGS_SHEET_ID}/values/ReportHistory!A:J?key=${process.env.GOOGLE_SHEETS_API_KEY}`
        const resp = await fetch(url, { next: { revalidate: 3600 } })
        if (!resp.ok) return null

        const data = await resp.json()
        const rows = data.values || []
        if (rows.length < 2) return null

        const headers = rows[0] as string[]
        const idIdx = headers.indexOf('studioId')
        const periodIdx = headers.indexOf('period')

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i] as string[]
            if (row[idIdx] === studioSlug && row[periodIdx] === period) {
                const obj: Record<string, string> = {}
                headers.forEach((h, idx) => {
                    obj[h] = row[idx] || '0'
                })
                return {
                    inquiriesHandled: parseInt(obj.inquiriesHandled) || 0,
                    bookingsCreated: parseInt(obj.bookingsCreated) || 0,
                    depositsCollected: parseFloat(obj.depositsCollected) || 0,
                    remindersSent: parseInt(obj.remindersSent) || 0,
                    noShowsPrevented: parseInt(obj.noShowsPrevented) || 0,
                    avgResponseTimeSec: parseInt(obj.avgResponseTimeSec) || 0,
                    calendarUtilisationPct: parseInt(obj.calendarUtilisationPct) || 0,
                }
            }
        }
        return null
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { studioSlug, period } = await params
    const studio = await getStudioData(studioSlug)

    if (!studio || studio.shareableOptIn !== 'TRUE') {
        return { title: 'Not Found' }
    }

    const title = `${studio.studioName} | ${formatMonth(period)} Results`
    const description = `See how ${studio.studioName} performed in ${formatMonth(period)} with their Apex Influence booking assistant.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'en_GB',
            siteName: 'Apex Influence',
        },
    }
}

export default async function ReportPage({ params }: PageProps) {
    const { studioSlug, period } = await params

    // Validate period format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(period)) notFound()

    const studio = await getStudioData(studioSlug)
    if (!studio || studio.shareableOptIn !== 'TRUE') notFound()

    const metrics = await getReportMetrics(studioSlug, period)
    if (!metrics) notFound()

    const headline =
        metrics.bookingsCreated > 0
            ? `${metrics.bookingsCreated} Booking${metrics.bookingsCreated !== 1 ? 's' : ''} Handled`
            : `${metrics.inquiriesHandled} Inquir${metrics.inquiriesHandled !== 1 ? 'ies' : 'y'} Handled`

    const stats = [
        { label: 'Inquiries Handled', value: String(metrics.inquiriesHandled) },
        { label: 'Bookings Created', value: String(metrics.bookingsCreated) },
        {
            label: 'Deposits Collected',
            value: `\u00a3${metrics.depositsCollected.toFixed(2)}`,
        },
    ]

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#111827] px-6 py-8 text-center">
                    <p className="text-[#9ca3af] text-sm tracking-wide uppercase">
                        {formatMonth(period)}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-white">{headline}</h1>
                    <p className="mt-1 text-[#9ca3af] text-sm">{studio.studioName}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                    {stats.map((stat) => (
                        <div key={stat.label} className="px-3 py-5 text-center">
                            <p className="text-xl font-bold text-[#111827]">{stat.value}</p>
                            <p className="mt-1 text-[10px] text-[#6b7280] uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Supporting Metrics */}
                <div className="px-6 py-5 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#374151]">Reminders Sent</span>
                        <span className="text-sm font-semibold text-[#111827]">
                            {metrics.remindersSent}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#374151]">No-Shows Prevented</span>
                        <span className="text-sm font-semibold text-[#111827]">
                            {metrics.noShowsPrevented}
                        </span>
                    </div>
                    {metrics.avgResponseTimeSec > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#374151]">Avg Response Time</span>
                            <span className="text-sm font-semibold text-[#111827]">
                                {metrics.avgResponseTimeSec}s
                            </span>
                        </div>
                    )}
                    {metrics.calendarUtilisationPct > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#374151]">Calendar Utilisation</span>
                            <span className="text-sm font-semibold text-[#111827]">
                                {metrics.calendarUtilisationPct}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-[#f9fafb] px-6 py-4 text-center border-t border-gray-100">
                    <p className="text-xs text-[#9ca3af]">
                        Powered by{' '}
                        <a
                            href="https://www.apexink.uk"
                            className="text-[#2563eb] hover:underline"
                        >
                            Apex Influence
                        </a>{' '}
                        — 24/7 booking assistant for tattoo studios
                    </p>
                </div>
            </div>
        </div>
    )
}
