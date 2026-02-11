'use client'

import { motion } from 'motion/react'
import { useStudio } from '@/lib/studio-context'

export function FinalCTA({ onBookingOpen }: { onBookingOpen: () => void }) {
  const { finalCta } = useStudio()
  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* Gold line */}
        <div className="mx-auto mb-10 h-px w-16 bg-accent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            {finalCta.headline}
          </h2>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            {finalCta.subheadline}
          </p>
          <button
            type="button"
            onClick={onBookingOpen}
            className="mt-10 inline-block bg-accent text-accent-foreground px-10 py-4 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-accent-glow"
          >
            {`${finalCta.ctaText} \u2192`}
          </button>
        </motion.div>

        {/* Gold line */}
        <div className="mx-auto mt-10 h-px w-16 bg-accent" />
      </div>
    </section>
  )
}
