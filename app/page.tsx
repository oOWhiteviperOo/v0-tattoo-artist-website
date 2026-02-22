import { Metadata } from 'next'
import { MarketingPage } from '@/components/marketing/MarketingPage'

export const metadata: Metadata = {
    title: 'Apex Ink | 24/7 Booking Assistant for UK Tattoo Studios',
    description: 'Stop losing bookings to slow replies. Your 24/7 booking assistant handles enquiries, deposits, and reminders — so you can focus on tattooing. 14-day free trial.',
    keywords: ['tattoo booking automation', 'UK tattoo studio', 'tattoo booking assistant', 'tattoo deposit collection', 'tattoo studio software'],
    openGraph: {
        title: 'Apex Ink | 24/7 Booking Assistant for UK Tattoo Studios',
        description: 'Stop losing bookings to slow replies. Your 24/7 booking assistant handles enquiries, deposits, and reminders — so you can focus on tattooing.',
        type: 'website',
        locale: 'en_GB',
        url: 'https://www.apexink.uk',
        siteName: 'Apex Ink',
    },
}

export default function Home() {
    return <MarketingPage />
}
