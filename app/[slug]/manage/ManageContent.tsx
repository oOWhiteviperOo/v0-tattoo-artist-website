'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { BookingAgent } from '@/components/BookingAgent'
import { StudioConfigProvider } from '@/lib/studio-context'
import { StudioConfig } from '@/lib/types/studio-config'

interface ManageContentProps {
  config: StudioConfig
  bookingRef?: string
}

export function ManageContent({ config, bookingRef }: ManageContentProps) {
  const [agentOpen, setAgentOpen] = useState(true)

  return (
    <StudioConfigProvider config={config}>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <MessageSquare className="h-6 w-6 text-accent" />
            </div>
          </div>
          <h1 className="font-display text-xl text-foreground">
            Manage Your Booking
          </h1>
          <p className="text-sm text-muted-foreground">
            {bookingRef
              ? `Managing booking ${bookingRef}. You can cancel or reschedule below.`
              : 'Enter your booking reference or email to manage your appointment.'}
          </p>
          {!agentOpen && (
            <button
              onClick={() => setAgentOpen(true)}
              className="mt-4 px-6 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
            >
              Open Chat
            </button>
          )}
        </div>
        <BookingAgent
          open={agentOpen}
          onOpenChange={setAgentOpen}
          studioSlug={config.identity.slug}
          bookingRef={bookingRef}
        />
      </div>
    </StudioConfigProvider>
  )
}
