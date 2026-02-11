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
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            {sessions.sectionTitle}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {sessions.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
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

        {/* Guarantee Block */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-3 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          <Shield className="h-5 w-5 text-accent" />
          <div>
            <span className="text-sm font-medium text-foreground">
              {sessions.guarantee}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
