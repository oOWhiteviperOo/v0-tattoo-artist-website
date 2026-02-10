'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { HERO_IMAGE, BLUR_DATA_URL } from '@/lib/constants'
import { GrainOverlay } from './GrainOverlay'

export function Hero({ onBookingOpen }: { onBookingOpen: () => void }) {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-[#0A0A0A]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pt-24 pb-12 lg:flex-row lg:gap-16 lg:pt-0 lg:pb-0">
        {/* Text content */}
        <motion.div
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="font-sans text-4xl font-extrabold uppercase leading-none tracking-tight text-[#F5F5F5] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-balance">
            Permanent Art.
            <br />
            Limited Slots.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#A1A1A1] sm:text-lg">
            Dark realism & blackwork tattoos by Raven Morales. Book your session
            at INK & IRON, Arts District, Los Angeles.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#C8A96E] animate-pulse-dot" />
            <span className="text-sm font-medium text-[#C8A96E]">
              Only 4 slots remaining this month
            </span>
          </div>
          <button
            type="button"
            onClick={onBookingOpen}
            className="mt-8 bg-[#C8A96E] text-[#0A0A0A] px-8 py-4 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(200,169,110,0.25)]"
          >
            {'Book Your Slot \u2192'}
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
            src={HERO_IMAGE || "/placeholder.svg"}
            alt="Tattoo artist Raven Morales working in the INK & IRON studio"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover animate-ken-burns"
            priority
          />
          <GrainOverlay />
        </motion.div>
      </div>
    </section>
  )
}
