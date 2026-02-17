'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'We clone your vibe',
    description:
      'Your branding, portfolio, and pricing into a custom booking page.',
  },
  {
    step: '02',
    title: 'We connect your tools',
    description:
      'Calendar, inbox, deposits \u2014 wired up so everything talks to each other.',
  },
  {
    step: '03',
    title: 'You get a working demo',
    description:
      'A live site you can test, share with clients, and start taking bookings from.',
  },
]

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 px-4 border-t border-border/30">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          What happens next
        </motion.p>

        <motion.h2
          className="font-display text-2xl md:text-3xl leading-[1.1] mb-10 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          From enquiry to working demo in 3 steps
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PROCESS_STEPS.map(({ step, title, description }, i) => (
            <motion.div
              key={step}
              className="flex gap-4 items-start"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 + i * STAGGER_DELAY }}
            >
              <span className="text-foreground/20 font-display text-2xl shrink-0">{step}</span>
              <div>
                <h3 className="text-foreground font-medium text-sm mb-1">{title}</h3>
                <p className="text-secondary-foreground/60 text-sm leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
