'use client'

import { Check } from 'lucide-react'
import type { SessionData } from '@/lib/types/studio-config'

interface SessionCardProps {
  session: SessionData
  popularLabel: string
  waitlistButtonText: string
  onBook: (title: string) => void
}

export function SessionCard({ session, popularLabel, waitlistButtonText, onBook }: SessionCardProps) {
  const isSoldOut = session.status === 'sold_out'

  return (
    <div className="group relative flex flex-col border border-border bg-card p-6 rounded-sm transition-colors duration-200 hover:border-accent/30 lg:p-8">
      {session.popular && (
        <div className="absolute -top-px left-6 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground rounded-b-sm">
          {popularLabel}
        </div>
      )}

      <h3 className="font-display text-xl font-normal text-foreground">
        {session.title}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">{session.duration}</p>

      <div className="mt-4 mb-6">
        <span className="font-display text-3xl font-normal text-foreground">{session.price}</span>
        <p className="mt-1 text-sm text-muted-foreground">{session.priceSubtitle}</p>
      </div>

      <ul className="mb-8 flex flex-col gap-3 flex-1">
        {session.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3">
        {session.availabilityText && (
          <span
            className={`text-xs font-medium ${isSoldOut ? 'text-muted-foreground' : session.status === 'limited' ? 'text-accent' : 'text-muted-foreground'}`}
          >
            {session.availabilityText}
          </span>
        )}

        <button
          type="button"
          onClick={() => onBook(session.title)}
          className={`w-full py-3 font-sans text-sm font-medium rounded-sm transition-colors duration-200 ${session.buttonVariant === 'default'
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : 'border border-border text-foreground hover:border-accent/30'
            } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSoldOut}
        >
          {isSoldOut ? waitlistButtonText : session.buttonText}
        </button>
      </div>
    </div>
  )
}
