import { Metadata } from 'next'
import { MarketingPage } from '@/components/marketing/MarketingPage'

export const metadata: Metadata = {
    title: 'Apex AI | 24/7 AI Receptionist for Aesthetics Clinics',
    description: 'Stop losing bookings to slow replies. Your AI receptionist handles enquiries, deposits, and reminders 24/7 — so you can focus on your patients. 14-day free trial.',
    keywords: ['aesthetics clinic booking', 'AI receptionist', 'clinic booking automation', 'aesthetics deposit collection', 'medical aesthetics software'],
    openGraph: {
        title: 'Apex AI | 24/7 AI Receptionist for Aesthetics Clinics',
        description: 'Stop losing bookings to slow replies. Your AI receptionist handles enquiries, deposits, and reminders 24/7 — so you can focus on your patients.',
        type: 'website',
        locale: 'en_GB',
        url: 'https://www.apexaisystems.co.uk',
        siteName: 'Apex AI',
    },
}

export default function Home() {
    return <MarketingPage />
}
