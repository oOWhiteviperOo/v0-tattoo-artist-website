'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { CheckCircle2, TrendingUp, Sparkles, Star } from 'lucide-react'
import { useStudio } from '@/lib/studio-context'
import { TestimonialCarousel } from './TestimonialCarousel'
import { TrustBadge } from '@/lib/types/studio-config'

const BADGE_ICON_MAP = {
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Star,
} as const

export function SocialProof() {
  const { socialProof, blurDataUrl } = useStudio()
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            {socialProof.sectionTitle}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <TestimonialCarousel testimonials={socialProof.testimonials} />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          {socialProof.trustBadges.map((badge: TrustBadge) => {
            const Icon = BADGE_ICON_MAP[badge.iconName]
            return (
              <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
                <Icon className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">{badge.label}</span>
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
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-dimmed">
            {socialProof.instagram.label}
          </p>
          <div
            className="grid grid-cols-3 gap-1 lg:grid-cols-6"
          >
            {socialProof.instagram.images.map((src, i) => (
              <div key={src} className="group relative aspect-square overflow-hidden bg-white/[0.03]">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Instagram post ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 16vw"
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
