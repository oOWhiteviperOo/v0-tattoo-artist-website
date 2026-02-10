'use client'

import { motion } from 'motion/react'
import { Shield } from 'lucide-react'
import { SESSIONS } from '@/lib/constants'
import { SessionCard } from './SessionCard'

export function Sessions({ onBookingOpen }: { onBookingOpen: (title?: string) => void }) {
  return (
    <section id="sessions" className="bg-[#0A0A0A] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl text-balance">
            Available Sessions
          </h2>
          <p className="mt-4 text-base text-[#A1A1A1] sm:text-lg">
            Limited slots. Serious clients only. Custom designs, no flash work.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          {SESSIONS.map((session) => (
            <SessionCard
              key={session.title}
              session={session}
              onBook={(title) => onBookingOpen(title)}
            />
          ))}
        </motion.div>

        {/* Guarantee Block */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-3 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          <Shield className="h-5 w-5 text-[#C8A96E]" />
          <div>
            <span className="text-sm font-medium text-[#F5F5F5]">
              30-Day Satisfaction Guarantee
            </span>
            <span className="ml-2 text-sm text-[#6B6B6B]">
              Not happy? Unlimited revisions within 30 days.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
