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
    <div className="group relative flex flex-col border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/15 hover:bg-white/[0.06] lg:p-8">
      {session.popular && (
        <div className="absolute -top-px left-6 bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          {popularLabel}
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <Icon className="h-5 w-5 text-accent" />
        <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-foreground">
          {session.title}
        </h3>
      </div>

      <p className="text-sm text-dimmed">{session.duration}</p>

      <div className="mt-4 mb-6">
        <span className="font-sans text-3xl font-extrabold text-foreground">{session.price}</span>
        <p className="mt-1 text-sm text-dimmed">{session.priceSubtitle}</p>
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
        <div className="flex items-center gap-2">
          {session.status === 'limited' && (
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
          )}
          <span
            className={`text-xs font-medium uppercase tracking-wider ${isSoldOut ? 'text-dimmed' : session.status === 'limited' ? 'text-accent' : 'text-muted-foreground'
              }`}
          >
            {session.availabilityText}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onBook(session.title)}
          className={`w-full py-3 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 ${session.buttonVariant === 'default'
              ? 'bg-accent text-accent-foreground hover:scale-[1.02] hover:shadow-accent-glow'
              : 'border border-white/[0.06] text-foreground hover:border-accent/15 hover:bg-white/[0.06]'
            } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSoldOut}
        >
          {isSoldOut ? waitlistButtonText : `${session.buttonText} \u2192`}
        </button>
      </div>
    </div>
  )
}
