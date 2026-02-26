'use client'

import Image from 'next/image'
import { Fragment } from 'react'
import { motion } from 'motion/react'
import { useStudio } from '@/lib/studio-context'
import { TestimonialCarousel } from './TestimonialCarousel'
import { TrustBadge } from '@/lib/types/studio-config'

export function SocialProof() {
  const { socialProof, blurDataUrl } = useStudio()

  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl text-balance">
            {socialProof.sectionTitle}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <TestimonialCarousel testimonials={socialProof.testimonials} />
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {socialProof.trustBadges.map((badge: TrustBadge, i: number) => (
            <Fragment key={badge.label}>
              {i > 0 && <span className="hidden sm:block h-4 w-px bg-border" />}
              <span className="text-sm text-muted-foreground">{badge.label}</span>
            </Fragment>
          ))}
        </div>

        {/* Instagram Strip */}
        <div className="mt-16">
          <p className="mb-4 text-center text-sm text-muted-foreground">
            {socialProof.instagram.label}
          </p>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
            {socialProof.instagram.images.map((src, i) => (
              <div key={src} className="group relative aspect-square overflow-hidden bg-background rounded">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Instagram post ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 16vw"
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  className="object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
