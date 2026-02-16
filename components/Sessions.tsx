'use client'

import { motion } from 'motion/react'
import { Shield } from 'lucide-react'
import { useStudio } from '@/lib/studio-context'
import { SessionCard } from './SessionCard'

export function Sessions({ onBookingOpen }: { onBookingOpen: (title?: string) => void }) {
  const { sessions } = useStudio()

  return (
    <section id="sessions" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl text-balance">
            {sessions.sectionTitle}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {sessions.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {sessions.items.map((session) => (
            <SessionCard
              key={session.title}
              session={session}
              popularLabel={sessions.popularLabel}
              waitlistButtonText={sessions.waitlistButtonText}
              onBook={(title) => onBookingOpen(title)}
            />
          ))}
        </motion.div>

        {sessions.guarantee && (
          <div className="mt-10 flex items-center justify-center gap-2.5">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              {sessions.guarantee}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
