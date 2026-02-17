'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

const DEMO_STUDIOS = [
  { slug: 'holier-than-thou', name: 'Holier Than Thou', city: 'Manchester' },
  { slug: 'frith-street-tattoo', name: 'Frith Street Tattoo', city: 'London' },
  { slug: 'rain-city-tattoo-collective', name: 'Rain City Tattoo', city: 'Manchester' },
  { slug: 'the-family-business-tattoo', name: 'The Family Business', city: 'London' },
  { slug: 'good-fortune-studio', name: 'Good Fortune Studio', city: 'London' },
  { slug: 'seven-dials-tattoo', name: 'Seven Dials Tattoo', city: 'Brighton' },
]

export function DemoShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="demos" ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-border/30 bg-secondary">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          Live demos
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          See it working for real studios
        </motion.h2>

        <motion.p
          className="text-secondary-foreground/80 max-w-[60ch] mb-12 text-base md:text-lg leading-[1.65]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 }}
        >
          Every demo below is a fully working booking page built for a real UK studio.
          Your branding, your work, live booking forms.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_STUDIOS.map(({ slug, name, city }, i) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 + i * STAGGER_DELAY }}
            >
              <Link
                href={`/${slug}`}
                className="group relative flex items-center justify-between px-5 py-6 md:py-8 border border-border/50 bg-card rounded-[10px] shadow-subtle transition-all duration-200 ease-out hover:-translate-y-1 hover:border-border/70 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/[0.04] before:rounded-t-[10px]"
              >
                <div>
                  <p className="text-foreground font-medium group-hover:text-foreground transition-colors duration-200">
                    {name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{city}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 9 }}
        >
          71 studios and counting.{' '}
          <span className="text-foreground">Yours could be next.</span>
        </motion.p>
      </div>
    </section>
  )
}
