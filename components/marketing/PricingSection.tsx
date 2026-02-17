'use client'

import { motion, useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { smoothScrollTo } from '@/lib/utils'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

const TIERS = [
  {
    name: 'Starter',
    price: '199',
    description: 'Everything you need to stop losing bookings',
    features: [
      'AI booking concierge',
      'Custom studio website',
      'Stripe deposit collection',
      'SMS + email reminders (48h, 24h, 2h)',
      'Google Calendar sync',
      'Slack alerts for your team',
      'Monthly check-in call',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '299',
    description: 'For studios ready to grow',
    features: [
      'Everything in Starter',
      'Multi-artist routing',
      'Review generation campaigns',
      'Post-appointment follow-ups',
      'Instagram DM auto-responses',
      'Monthly analytics report',
      'Priority same-day support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Studio Ops',
    price: '499',
    description: 'Full operations automation',
    features: [
      'Everything in Pro',
      'Live analytics dashboard',
      'Client reactivation sequences',
      'Waitlist auto-fill on cancellations',
      'KPI reporting',
      'Custom integrations',
      'Quarterly strategy calls',
    ],
    cta: 'Contact Us',
    popular: false,
  },
]

const VISIBLE_FEATURES = 6

function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  popular,
  inView,
  index,
}: {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  popular: boolean
  inView: boolean
  index: number
}) {
  const [expanded, setExpanded] = useState(false)
  const visibleFeatures = expanded ? features : features.slice(0, VISIBLE_FEATURES)
  const hasMore = features.length > VISIBLE_FEATURES

  return (
    <motion.div
      className={`relative p-6 lg:p-8 border bg-card rounded-[10px] flex flex-col transition-all duration-200 ease-out ${
        popular ? 'border-accent/70 scale-[1.06] z-10' : 'border-border/40'
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 + index * STAGGER_DELAY }}
    >
      {popular && (
        <span className="absolute -top-3 left-6 px-3 py-0.5 bg-accent text-accent-foreground text-xs font-medium tracking-wide rounded-[4px]">
          Most Popular
        </span>
      )}
      <h3 className="text-foreground font-medium text-lg">{name}</h3>
      <div className="mt-4 mb-1">
        <span className="text-4xl font-display text-foreground">&pound;{price}</span>
        <span className="text-muted-foreground text-sm">/month</span>
      </div>
      <p className="text-sm text-muted-foreground mb-8">{description}</p>
      <ul className="space-y-3 mb-8 flex-1">
        {visibleFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/70 mt-2 shrink-0" />
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          See all features &rarr;
        </button>
      )}
      <button
        type="button"
        onClick={() => smoothScrollTo('contact')}
        className={`block w-full text-center py-3 text-sm font-medium transition-all duration-200 rounded-[8px] ${
          popular
            ? 'bg-accent text-accent-foreground hover:bg-accent-hover hover:shadow-glow active:translate-y-[1px] active:bg-accent-pressed'
            : 'border border-border text-foreground/80 hover:border-accent/70'
        }`}
      >
        {cta}
      </button>
    </motion.div>
  )
}

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="pricing" ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-border/30">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          Pricing
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          Less than your monthly ink spend
        </motion.h2>

        <motion.p
          className="text-muted-foreground max-w-xl mb-14 text-base md:text-lg leading-[1.65]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 }}
        >
          No contracts. Cancel anytime. 14-day free trial on every plan.
          If we don&apos;t book you 5+ extra sessions in 30 days, you don&apos;t pay.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {TIERS.map((tier, i) => (
            <PricingCard key={tier.name} {...tier} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
