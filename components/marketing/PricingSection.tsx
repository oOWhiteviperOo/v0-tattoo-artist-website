'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { smoothScrollTo } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

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

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="pricing" ref={sectionRef} className="py-24 lg:py-32 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Pricing
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          Less than your monthly ink spend
        </motion.h2>

        <motion.p
          className="text-muted-foreground max-w-xl mb-14 text-base md:text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        >
          No contracts. Cancel anytime. 14-day free trial on every plan.
          If we don&apos;t book you 5+ extra sessions in 30 days, you don&apos;t pay.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map(({ name, price, description, features, cta, popular }, i) => (
            <motion.div
              key={name}
              className={`relative p-6 lg:p-8 border bg-card/30 flex flex-col ${
                popular ? 'border-accent/50' : 'border-border/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.1 }}
            >
              {popular && (
                <span className="absolute -top-3 left-6 px-3 py-0.5 bg-accent text-accent-foreground text-xs font-medium tracking-wide">
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
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent/70 mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => smoothScrollTo('contact')}
                className={`block w-full text-center py-3 text-sm font-medium transition-all duration-200 ${
                  popular
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98]'
                    : 'border border-border text-foreground/80 hover:border-foreground/30'
                }`}
              >
                {cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
