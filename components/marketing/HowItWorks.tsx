'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

const STEPS = [
  {
    step: '01',
    title: 'We build your booking page',
    description:
      'A proper website for your studio \u2014 your work, your branding, a booking form that actually works. Live in 24 hours.',
    chip: 'Replies in <60s',
  },
  {
    step: '02',
    title: 'AI handles the back-and-forth',
    description:
      'Someone enquires, the system checks your calendar, sends a deposit link, confirms the booking. Under 60 seconds. No DMs required.',
    chip: 'Deposits collected',
  },
  {
    step: '03',
    title: 'You just tattoo',
    description:
      'Reminders go out automatically. Deposits land before the session. Your chair stays full. We handle the boring stuff.',
    chip: 'No-shows drop',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-border/30">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          How it works
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-16 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          Three steps. Zero effort from you.
        </motion.h2>

        <div className="relative">
          {/* Vertical connecting rail */}
          <motion.div
            className="absolute left-[23px] top-0 bottom-0 w-px bg-border/35 hidden md:block"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: STAGGER_DELAY * 2 }}
            style={{ transformOrigin: 'top' }}
          />

          <div className="flex flex-col gap-14 md:gap-20">
            {STEPS.map(({ step, title, description, chip }, i) => (
              <motion.div
                key={step}
                className="relative flex gap-6 md:gap-10 items-start"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 + i * STAGGER_DELAY * 2 }}
              >
                {/* Step number */}
                <div className="relative shrink-0 w-12 h-12 flex items-center justify-center border border-border/50 bg-background rounded-[8px] z-10">
                  <span className="text-foreground/40 font-display text-2xl md:text-3xl">{step}</span>
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3 className="text-foreground font-medium text-lg md:text-xl mb-2">{title}</h3>
                  <p className="text-secondary-foreground/70 text-sm md:text-base leading-relaxed max-w-[55ch]">
                    {description}
                  </p>
                  <span className="inline-block mt-3 px-3 py-1 border border-border/40 rounded text-xs text-muted-foreground">
                    {chip}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
