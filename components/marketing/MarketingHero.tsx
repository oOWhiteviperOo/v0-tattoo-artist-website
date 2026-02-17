'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { GrainOverlay } from '@/components/GrainOverlay'
import { smoothScrollTo } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

export function MarketingHero() {
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=1600&h=1000&fit=crop&q=80"
          alt="Tattoo artist at work in a dark studio"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <GrainOverlay opacity={0.04} />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 pb-24 lg:pb-32">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-accent/30 text-accent text-xs font-medium tracking-wider uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          Now onboarding UK studios
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] text-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          Stop losing bookings
          <br />
          <span className="text-accent">to slow replies</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-foreground/65"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
        >
          Your DMs are buried. Your diary&apos;s a mess. People ghost after asking
          for a quote. We fix all of that&nbsp;&mdash; so you can get back to
          actually tattooing.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
        >
          <button
            type="button"
            onClick={() => smoothScrollTo('contact')}
            className="bg-accent text-accent-foreground px-8 py-3.5 text-sm font-medium transition-all duration-200 hover:bg-accent/90 active:scale-[0.98]"
          >
            Book a Demo
          </button>
          <button
            type="button"
            onClick={() => smoothScrollTo('demos')}
            className="border border-border text-foreground/80 px-8 py-3.5 text-sm font-medium transition-colors hover:border-foreground/30"
          >
            See Live Demos
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <ChevronDown className="h-5 w-5 text-foreground/25 animate-bounce" />
      </motion.div>
    </section>
  )
}
