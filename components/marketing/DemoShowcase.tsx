'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

const EASE = [0.22, 1, 0.36, 1] as const

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
    <section id="demos" ref={sectionRef} className="py-24 lg:py-32 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Live demos
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          See it working for real studios
        </motion.h2>

        <motion.p
          className="text-muted-foreground max-w-xl mb-12 text-base md:text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        >
          Every demo below is a fully working booking page built for a real UK studio.
          Your branding, your work, live booking forms.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_STUDIOS.map(({ slug, name, city }, i) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.08 }}
            >
              <Link
                href={`/${slug}`}
                className="group flex items-center justify-between p-5 border border-border/50 bg-card/30 hover:border-accent/30 hover:bg-card/60 transition-all duration-300"
              >
                <div>
                  <p className="text-foreground font-medium group-hover:text-accent transition-colors duration-200">
                    {name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{city}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.7 }}
        >
          71 studios and counting.{' '}
          <span className="text-accent">Yours could be next.</span>
        </motion.p>
      </div>
    </section>
  )
}
