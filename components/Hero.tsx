'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { useStudio } from '@/lib/studio-context'
import { GrainOverlay } from './GrainOverlay'

export function Hero({ onBookingOpen }: { onBookingOpen: () => void }) {
  const { hero, blurDataUrl } = useStudio()

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pt-24 pb-12 lg:flex-row lg:gap-16 lg:pt-0 lg:pb-0">
        {/* Text content */}
        <motion.div
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="font-sans text-4xl font-extrabold uppercase leading-none tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-balance">
            {hero.headline.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.subheadline}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="text-sm font-medium text-accent">
              {hero.urgencyText}
            </span>
          </div>
          <button
            type="button"
            onClick={onBookingOpen}
            className="mt-8 bg-accent text-accent-foreground px-8 py-4 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-accent-glow"
          >
            {hero.ctaText} {'\u2192'}
          </button>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative flex-1 w-full aspect-[3/4] max-h-[70vh] lg:max-h-[80vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
          <Image
            src={hero.image || "/placeholder.svg"}
            alt={hero.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
            placeholder="blur"
            blurDataURL={blurDataUrl}
            className="object-cover animate-ken-burns"
            priority
          />
          <GrainOverlay />
        </motion.div>
      </div>
    </section>
  )
}
