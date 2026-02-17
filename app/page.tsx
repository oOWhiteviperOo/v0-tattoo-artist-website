import { Metadata } from 'next'
import { MarketingPage } from '@/components/MarketingPage'

export const metadata: Metadata = {
    title: 'Apex Ink | AI Booking Automation for UK Tattoo Studios',
    description: 'Stop losing bookings to slow replies. AI-powered booking automation handles DMs, deposits, and reminders for UK tattoo studios. 14-day free trial.',
    keywords: ['tattoo booking automation', 'UK tattoo studio', 'AI booking', 'tattoo deposit collection', 'tattoo studio software'],
    openGraph: {
        title: 'Apex Ink | AI Booking Automation for UK Tattoo Studios',
        description: 'Stop losing bookings to slow replies. AI-powered booking automation handles DMs, deposits, and reminders for UK tattoo studios.',
        type: 'website',
        locale: 'en_GB',
        url: 'https://www.apexink.uk',
        siteName: 'Apex Ink',
    },
}

export default function Home() {
    return <MarketingPage />
}
