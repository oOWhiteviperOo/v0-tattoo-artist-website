'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { TrustBar } from '@/components/TrustBar'
import { Portfolio } from '@/components/Portfolio'
import { Sessions } from '@/components/Sessions'
import { SocialProof } from '@/components/SocialProof'
import { About } from '@/components/About'
import { FAQ } from '@/components/FAQ'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'
import { BookingModal } from '@/components/BookingModal'
import { BookingAgent } from '@/components/BookingAgent'
import { ScrollToTop } from '@/components/ScrollToTop'
import { StudioConfigProvider } from '@/lib/studio-context'
import { StudioConfig } from '@/lib/types/studio-config'

export function StudioPage({ config }: { config: StudioConfig }) {
    const [bookingOpen, setBookingOpen] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [demoOpen, setDemoOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState<string | undefined>()

    // Primary CTA — opens conversational BookingAgent
    const openBooking = useCallback((sessionTitle?: string) => {
        setSelectedSession(sessionTitle)
        setBookingOpen(true)
    }, [])

    const openBookingDefault = useCallback(() => {
        setSelectedSession(undefined)
        setBookingOpen(true)
    }, [])

    // Fallback — opens traditional form (triggered from "Prefer a form?" in BookingAgent)
    const openForm = useCallback(() => {
        setFormOpen(true)
    }, [])

    const openDemo = useCallback(() => {
        setDemoOpen(true)
    }, [])

    return (
        <StudioConfigProvider config={config}>
            <main>
                <Header onBookingOpen={openBookingDefault} />
                <Hero onBookingOpen={openBookingDefault} onDemoOpen={openDemo} />
                <TrustBar />
                <Portfolio />
                <Sessions onBookingOpen={openBooking} />
                <SocialProof />
                <About />
                <FAQ />
                <FinalCTA onBookingOpen={openBookingDefault} />
                <Footer onBookingOpen={openBookingDefault} />
                <BookingAgent
                    open={bookingOpen}
                    onOpenChange={setBookingOpen}
                    studioSlug={config.identity.slug}
                    onOpenForm={openForm}
                />
                <BookingAgent
                    open={demoOpen}
                    onOpenChange={setDemoOpen}
                    studioSlug={config.identity.slug}
                    demoMode
                />
                <BookingModal
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    sessionTitle={selectedSession}
                />
                <ScrollToTop />
            </main>
        </StudioConfigProvider>
    )
}
