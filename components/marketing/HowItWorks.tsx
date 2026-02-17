'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

const STEPS = [
  {
    step: '01',
    title: 'We build your booking page',
    description:
      'A proper website for your studio \u2014 your work, your branding, a booking form that actually works. Live in 24 hours.',
  },
  {
    step: '02',
    title: 'AI handles the back-and-forth',
    description:
      'Someone enquires, the system checks your calendar, sends a deposit link, confirms the booking. Under 60 seconds. No DMs required.',
  },
  {
    step: '03',
    title: 'You just tattoo',
    description:
      'Reminders go out automatically. Deposits land before the session. Your chair stays full. We handle the boring stuff.',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 lg:py-32 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          How it works
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-16 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          Three steps. Zero effort from you.
        </motion.h2>

        <div className="relative">
          {/* Vertical connecting line */}
          <motion.div
            className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent hidden md:block"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            style={{ transformOrigin: 'top' }}
          />

          <div className="flex flex-col gap-12 md:gap-16">
            {STEPS.map(({ step, title, description }, i) => (
              <motion.div
                key={step}
                className="relative flex gap-6 md:gap-10 items-start"
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.15 }}
              >
                {/* Step number */}
                <div className="relative shrink-0 w-12 h-12 flex items-center justify-center border border-accent/30 bg-background z-10">
                  <span className="text-accent font-display text-lg">{step}</span>
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3 className="text-foreground font-medium text-lg md:text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
