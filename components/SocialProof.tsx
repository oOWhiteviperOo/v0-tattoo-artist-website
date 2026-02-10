'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Sparkles, Star } from 'lucide-react'
import { TESTIMONIALS, TRUST_BADGES, INSTAGRAM_IMAGES, CONTACT, BLUR_DATA_URL } from '@/lib/constants'
import { TestimonialCarousel } from './TestimonialCarousel'

const BADGE_ICON_MAP = {
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Star,
} as const

export function SocialProof() {
  return (
    <section className="bg-[#0A0A0A] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl text-balance">
            What Clients Are Saying
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          {TRUST_BADGES.map((badge) => {
            const Icon = BADGE_ICON_MAP[badge.iconName]
            return (
              <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
                <Icon className="h-5 w-5 text-[#C8A96E]" />
                <span className="text-sm text-[#A1A1A1]">{badge.label}</span>
              </div>
            )
          })}
        </motion.div>

        {/* Instagram Strip */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
        >
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-[#6B6B6B]">
            Follow {CONTACT.instagram} on Instagram
          </p>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grid grid-cols-3 gap-1 lg:grid-cols-6"
            aria-label="View our Instagram profile"
          >
            {INSTAGRAM_IMAGES.map((src, i) => (
              <div key={src} className="group relative aspect-square overflow-hidden bg-white/[0.03]">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Instagram post ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 16vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
