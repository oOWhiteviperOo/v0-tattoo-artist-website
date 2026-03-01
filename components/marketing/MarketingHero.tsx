'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { smoothScrollTo } from '@/lib/utils'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

export function MarketingHero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-background">
      {/* Decorative background — soft gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-secondary/50" />
        <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-gradient-to-bl from-accent/[0.04] to-transparent rounded-bl-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-content px-4 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div className="text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-accent/30 bg-accent/[0.06] text-accent font-semibold tracking-[0.1em] text-xs uppercase rounded-full"
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              5 founding clinic spots left
            </motion.div>

            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.18] tracking-[-0.02em] text-foreground max-w-[95%] lg:max-w-[90%]"
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
            >
              Stop losing bookings
              <br />
              <span className="text-accent">to slow replies</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-[50ch] text-base md:text-lg leading-[1.65] text-muted-foreground"
              initial={{ y: 6 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 }}
            >
              Someone DMs about lip filler at 9pm. You&apos;re mid-consultation. By morning,
              they&apos;ve booked somewhere else. We fix that&nbsp;&mdash; so you can focus on
              running your clinic.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-4 sm:flex-row items-center sm:items-center lg:items-start"
              initial={{ y: 6 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 5 }}
            >
              <button
                type="button"
                onClick={() => smoothScrollTo('contact')}
                className="bg-accent text-accent-foreground px-8 py-3.5 text-sm font-medium rounded-[8px] transition-all duration-200 hover:bg-accent-hover hover:shadow-glow active:translate-y-[1px] active:bg-accent-pressed"
              >
                Book a Demo
              </button>
              <button
                type="button"
                onClick={() => smoothScrollTo('demos')}
                className="border border-border text-foreground/80 px-8 py-3.5 text-sm font-medium rounded-[8px] transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
              >
                See Live Demos
              </button>
            </motion.div>

            <motion.p
              className="mt-5 text-xs text-muted-foreground/70"
              initial={{ y: 6 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 7 }}
            >
              No contract{' \u00b7 '}Cancel anytime{' \u00b7 '}UK clinics{' \u00b7 '}Done-for-you setup
            </motion.p>
          </div>

          {/* Right — Hero image */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ x: 24 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: STAGGER_DELAY * 4 }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=1000&fit=crop&q=80"
                alt="Modern aesthetics clinic interior"
                fill
                sizes="(min-width: 1024px) 50vw, 0vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Overlay caption pill */}
            <div className="absolute bottom-6 left-6 right-6 z-10 px-6 py-3 bg-foreground text-center backdrop-blur-sm rounded-full">
              <p className="text-white text-xs font-medium tracking-wide">
                Replies in 10 seconds, even mid-treatment.
              </p>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/[0.06] rounded-xl -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        initial={{ y: 4 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.4, duration: 0.22 }}
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground/40 animate-bounce" />
      </motion.div>
    </section>
  )
}
