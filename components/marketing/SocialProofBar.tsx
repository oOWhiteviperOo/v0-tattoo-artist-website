'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

const STATS = [
  { value: 71, label: 'Demo sites built' },
  { value: 60, suffix: 's', label: 'AI reply time' },
  { value: 0, prefix: '£', label: 'Setup fee' },
  { value: 14, suffix: '-day', label: 'Free trial' },
]

function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  inView,
}: {
  value: number
  prefix?: string
  suffix?: string
  inView: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setCount(value)
      return
    }

    let frame: number
    const duration = 1600
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <span className="font-display text-4xl md:text-5xl text-foreground tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative border-y border-border/30 bg-secondary">
      <div className="mx-auto max-w-content px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`text-center ${i < STATS.length - 1 ? 'md:border-r md:border-border/35' : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.22, delay: i * STAGGER_DELAY, ease: EASE }}
            >
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                inView={inView}
              />
              <p className="mt-1 text-xs md:text-sm uppercase font-semibold tracking-[0.1em] text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
