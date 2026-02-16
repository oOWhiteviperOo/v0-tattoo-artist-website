'use client'

import { motion } from 'motion/react'
import { useStudio } from '@/lib/studio-context'

export function FinalCTA({ onBookingOpen }: { onBookingOpen: () => void }) {
  const { finalCta } = useStudio()
  return (
    <section className="relative bg-card py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.04),transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl lg:text-5xl text-balance">
            {finalCta.headline}
          </h2>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            {finalCta.subheadline}
          </p>
          <button
            type="button"
            onClick={onBookingOpen}
            className="mt-10 inline-block bg-accent text-accent-foreground px-10 py-3.5 font-sans text-sm font-medium rounded transition-all duration-200 hover:bg-accent/90 hover:shadow-subtle active:scale-[0.98]"
          >
            {finalCta.ctaText}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
