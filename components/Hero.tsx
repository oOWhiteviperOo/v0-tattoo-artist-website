'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useStudio } from '@/lib/studio-context'

export function Hero({ onBookingOpen }: { onBookingOpen: () => void }) {
  const { hero, blurDataUrl } = useStudio()

  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src={hero.image || "/placeholder.svg"}
          alt={hero.imageAlt}
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurDataUrl}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 lg:pb-32">
        <motion.h1
          className="font-display text-4xl font-normal leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl text-balance"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.headline.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-5 max-w-lg text-base leading-relaxed text-foreground/70 sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          {hero.subheadline}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        >
          <button
            type="button"
            onClick={onBookingOpen}
            className="bg-accent text-accent-foreground px-8 py-3.5 font-sans text-sm font-medium rounded transition-all duration-200 hover:bg-accent/90 hover:shadow-elevated active:scale-[0.98]"
          >
            {hero.ctaText}
          </button>
          {hero.urgencyText && (
            <span className="text-sm text-foreground/50">
              {hero.urgencyText}
            </span>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <ChevronDown className="h-5 w-5 text-foreground/30 animate-bounce" />
      </motion.div>
    </section>
  )
}
