'use client'

import { Zap, Clock, Calendar, Check } from 'lucide-react'
import type { SessionData } from '@/lib/constants'

const ICON_MAP = {
  Zap,
  Clock,
  Calendar,
} as const

interface SessionCardProps {
  session: SessionData
  onBook: (title: string) => void
}

export function SessionCard({ session, onBook }: SessionCardProps) {
  const Icon = ICON_MAP[session.iconName]
  const isSoldOut = session.status === 'sold_out'

  return (
    <div className="group relative flex flex-col border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A96E]/15 hover:bg-white/[0.06] lg:p-8">
      {session.popular && (
        <div className="absolute -top-px left-6 bg-[#C8A96E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
          Most Popular
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#C8A96E]" />
        <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-[#F5F5F5]">
          {session.title}
        </h3>
      </div>

      <p className="text-sm text-[#6B6B6B]">{session.duration}</p>

      <div className="mt-4 mb-6">
        <span className="font-sans text-3xl font-extrabold text-[#F5F5F5]">{session.price}</span>
        <p className="mt-1 text-sm text-[#6B6B6B]">{session.priceSubtitle}</p>
      </div>

      <ul className="mb-8 flex flex-col gap-3 flex-1">
        {session.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#A1A1A1]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A96E]" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {session.status === 'limited' && (
            <span className="inline-block h-2 w-2 rounded-full bg-[#C8A96E] animate-pulse-dot" />
          )}
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              isSoldOut ? 'text-[#6B6B6B]' : session.status === 'limited' ? 'text-[#C8A96E]' : 'text-[#A1A1A1]'
            }`}
          >
            {session.availabilityText}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onBook(session.title)}
          className={`w-full py-3 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            session.buttonVariant === 'default'
              ? 'bg-[#C8A96E] text-[#0A0A0A] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(200,169,110,0.25)]'
              : 'border border-white/[0.06] text-[#F5F5F5] hover:border-[#C8A96E]/15 hover:bg-white/[0.06]'
          } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSoldOut}
        >
          {isSoldOut ? 'Join Waitlist' : `${session.buttonText} \u2192`}
        </button>
      </div>
    </div>
  )
}
