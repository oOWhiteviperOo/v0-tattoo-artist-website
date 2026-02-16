'use client'

import { Zap, Clock, Calendar, Check } from 'lucide-react'
import type { SessionData } from '@/lib/types/studio-config'

const ICON_MAP = {
  Zap,
  Clock,
  Calendar,
} as const

interface SessionCardProps {
  session: SessionData
  popularLabel: string
  waitlistButtonText: string
  onBook: (title: string) => void
}

export function SessionCard({ session, popularLabel, waitlistButtonText, onBook }: SessionCardProps) {
  const Icon = ICON_MAP[session.iconName]
  const isSoldOut = session.status === 'sold_out'

  return (
    <div className="group relative flex flex-col border border-border bg-card p-6 rounded transition-all duration-300 hover:border-accent/30 hover:shadow-elevated lg:p-8">
      {session.popular && (
        <div className="absolute -top-px left-6 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground rounded-b">
          {popularLabel}
        </div>
      )}

      <div className="flex items-center gap-3 mb-1">
        <Icon className="h-4 w-4 text-accent" />
        <h3 className="font-display text-xl font-normal text-foreground">
          {session.title}
        </h3>
      </div>

      <p className="text-sm text-muted-foreground">{session.duration}</p>

      <div className="mt-5 mb-6">
        <span className="font-display text-4xl text-foreground">{session.price}</span>
        <p className="mt-1 text-sm text-muted-foreground">{session.priceSubtitle}</p>
      </div>

      <ul className="mb-8 flex flex-col gap-3 flex-1">
        {session.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
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
          className={`w-full py-3 font-sans text-sm font-medium rounded transition-all duration-200 active:scale-[0.98] ${session.buttonVariant === 'default'
              ? 'bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-subtle'
              : 'border border-border text-foreground hover:border-accent/30 hover:bg-card'
            } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSoldOut}
        >
          {isSoldOut ? waitlistButtonText : session.buttonText}
        </button>
      </div>
    </div>
  )
}
