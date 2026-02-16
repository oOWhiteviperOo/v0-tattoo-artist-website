'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="font-display text-4xl font-normal leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl xl:text-7xl text-balance">
          {hero.headline.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          {hero.subheadline}
        </p>
        <button
          type="button"
          onClick={onBookingOpen}
          className="mt-8 bg-accent text-accent-foreground px-8 py-3.5 font-sans text-sm font-medium rounded-sm transition-colors duration-200 hover:bg-accent/90"
        >
          {hero.ctaText}
        </button>
      </motion.div>
    </section>
  )
}
