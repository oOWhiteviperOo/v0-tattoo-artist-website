'use client'

import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useStudio } from '@/lib/studio-context'
import { TestimonialCarousel } from './TestimonialCarousel'
import { TrustBadge } from '@/lib/types/studio-config'

interface AdoptionMetrics {
  activeStudios: number
  totalBookings: number
  sitesBuilt: number
  avgResponseTimeSec: number | null
}

export function SocialProof() {
  const { socialProof, blurDataUrl } = useStudio()
  const [adoption, setAdoption] = useState<AdoptionMetrics | null>(null)

  useEffect(() => {
    fetch('/api/metrics')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setAdoption(data) })
      .catch(() => {})
  }, [])

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

        {/* Adoption Metrics */}
        {adoption && (
          <motion.div
            className="mt-12 border border-border/50 rounded-lg p-6 bg-background/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground/60 mb-4">
              Built for UK Tattoo Studios
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {adoption.activeStudios >= 3 ? (
                <>
                  <div>
                    <p className="font-display text-2xl text-foreground">{adoption.activeStudios}</p>
                    <p className="text-xs text-muted-foreground mt-1">Studios Automated</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-foreground">{adoption.totalBookings}</p>
                    <p className="text-xs text-muted-foreground mt-1">Bookings This Month</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-foreground">
                      {adoption.avgResponseTimeSec ? `${adoption.avgResponseTimeSec}s` : '<60s'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Avg Response</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-display text-2xl text-foreground">{adoption.sitesBuilt}+</p>
                    <p className="text-xs text-muted-foreground mt-1">Studios Researched</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-foreground">24/7</p>
                    <p className="text-xs text-muted-foreground mt-1">Always Available</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-foreground">UK</p>
                    <p className="text-xs text-muted-foreground mt-1">Built in Britain</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

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
