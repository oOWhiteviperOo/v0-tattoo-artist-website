import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ReferralForm } from './ReferralForm'

interface PageProps {
    params: Promise<{ studioSlug: string }>
}

const N8N_BASE = process.env.N8N_BASE_URL || 'https://n8n.apexink.uk'

async function getStudioName(studioSlug: string): Promise<string | null> {
    try {
        const url = `${N8N_BASE}/webhook/studio-data?action=getStudio&studioSlug=${encodeURIComponent(studioSlug)}`
        const resp = await fetch(url, { next: { revalidate: 3600 } })
        if (!resp.ok) return null

        const data = await resp.json()
        if (!data.found) return null
        return data.studioName || null
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { studioSlug } = await params
    const studioName = await getStudioName(studioSlug)

    if (!studioName) return { title: 'Not Found' }

    return {
        title: `${studioName} recommends Apex Influence`,
        description: `${studioName} uses Apex Influence to manage bookings 24/7. Want the same for your studio?`,
        openGraph: {
            title: `${studioName} recommends Apex Influence`,
            description: `${studioName} uses Apex Influence to manage bookings 24/7. Want the same for your studio?`,
            type: 'website',
            locale: 'en_GB',
            siteName: 'Apex Influence',
        },
    }
}

export default async function ReferralPage({ params }: PageProps) {
    const { studioSlug } = await params
    const studioName = await getStudioName(studioSlug)

    if (!studioName) notFound()

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#111827] px-6 py-8 text-center">
                    <p className="text-[#9ca3af] text-xs uppercase tracking-wider">
                        Recommended by
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-white">{studioName}</h1>
                    <p className="mt-3 text-[#d1d5db] text-sm leading-relaxed">
                        uses Apex Influence to manage their bookings 24/7
                    </p>
                </div>

                {/* Value Props */}
                <div className="px-6 py-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-[#111827] text-center">
                        Want the same for your studio?
                    </h2>
                    <ul className="mt-4 space-y-2.5 text-sm text-[#374151]">
                        <li className="flex items-start gap-2">
                            <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                            <span>24/7 booking assistant responds in under 60 seconds</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                            <span>Automated deposits, reminders, and calendar management</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                            <span>Less than a part-time receptionist, pays for itself with one extra booking</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                            <span>Built in the UK, for UK tattoo studios</span>
                        </li>
                    </ul>
                </div>

                {/* Form */}
                <ReferralForm studioSlug={studioSlug} />

                {/* Footer */}
                <div className="bg-[#f9fafb] px-6 py-4 text-center border-t border-gray-100">
                    <p className="text-xs text-[#9ca3af]">
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
