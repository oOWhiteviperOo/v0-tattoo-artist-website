'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

const DEMO_STUDIOS = [
  { slug: 'glow-aesthetics', name: 'Glow Aesthetics', city: 'London', feature: 'Aesthetics clinic demo', highlighted: true },
  { slug: 'holier-than-thou', name: 'Holier Than Thou', city: 'Manchester', feature: 'AI booking form', highlighted: false },
  { slug: 'frith-street-tattoo', name: 'Frith Street Tattoo', city: 'London', feature: 'Multi-artist routing', highlighted: false },
  { slug: 'rain-city-tattoo-collective', name: 'Rain City Tattoo', city: 'Manchester', feature: 'Deposit collection', highlighted: false },
  { slug: 'the-family-business-tattoo', name: 'The Family Business', city: 'London', feature: 'Session pricing', highlighted: false },
  { slug: 'good-fortune-studio', name: 'Good Fortune Studio', city: 'London', feature: 'Portfolio showcase', highlighted: false },
]

export function DemoShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="demos" ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-hairline bg-secondary">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          Live demos
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
          initial={{ y: 8 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          See what we&apos;ll build for you
        </motion.h2>

        <motion.p
          className="text-secondary-foreground/80 max-w-[60ch] mb-4 text-base md:text-lg leading-[1.65]"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 }}
        >
          We built this system for tattoo studios first. Now we&apos;re bringing
          the same technology to aesthetics clinics.
        </motion.p>

        <motion.p
          className="text-muted-foreground max-w-[60ch] mb-12 text-sm leading-relaxed"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2.5 }}
        >
          Pick a demo below and try the booking flow yourself &mdash; every enquiry handled in under 60 seconds, deposits collected, reminders sent.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_STUDIOS.map(({ slug, name, city, feature, highlighted }, i) => (
            <motion.div
              key={slug}
              initial={{ y: 8 }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 + i * STAGGER_DELAY }}
            >
              <Link
                href={`/${slug}`}
                className={`group relative flex items-center justify-between px-5 py-6 md:py-8 bg-card rounded-[10px] shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-elevated ${
                  highlighted ? 'border-2 border-accent/40' : 'border border-hairline hover:border-foreground/20'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-medium group-hover:text-foreground transition-colors duration-200">
                      {name}
                    </p>
                    {highlighted && (
                      <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wider rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{city}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1.5 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-accent/40 shrink-0" />
                    {feature}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-sm text-muted-foreground mt-8"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 9 }}
        >
          Each demo is fully functional &mdash; live forms, real calendar, Stripe deposits.
        </motion.p>
      </div>
    </section>
  )
}
