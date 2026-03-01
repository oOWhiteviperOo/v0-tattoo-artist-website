'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { EASE } from '@/lib/marketing-motion'

export function ProofQuote() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 px-4 border-t border-hairline">
      <div className="max-w-content mx-auto">
        <motion.blockquote
          className="border-l-2 border-accent/30 pl-6 md:pl-8 max-w-[640px]"
          initial={{ x: -8 }}
          animate={inView ? { x: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <p className="text-foreground/90 text-lg md:text-xl lg:text-2xl leading-[1.5] font-display">
            &ldquo;Every hour you spend chasing DMs is an hour you&apos;re not
            treating patients. We built this because we saw too many
            practitioners drowning in admin.&rdquo;
          </p>
          <footer className="mt-4">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">
              The Apex AI team
            </p>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  )
}
