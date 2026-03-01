'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { MessageSquare, Clock, CreditCard } from 'lucide-react'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

const PROBLEMS = [
  {
    icon: MessageSquare,
    title: 'DMs go cold overnight',
    firstLine:
      '"Do you do lip filler?" at 10pm. You see it at 8am. They booked somewhere else at midnight.',
    description: 'Every slow reply is lost revenue.',
  },
  {
    icon: Clock,
    title: 'Admin is eating into clinic time',
    firstLine:
      'Replying to enquiries, checking availability, chasing deposits between consultations.',
    description:
      "You trained to treat patients, not play receptionist.",
  },
  {
    icon: CreditCard,
    title: 'No-shows are burning your revenue',
    firstLine: 'No deposit, no commitment. A missed Botox appointment is \u00A3200+ gone.',
    description: "Empty treatment rooms don\u2019t pay rent.",
  },
]

export function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="problem" ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-border/30 bg-secondary">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          The problem
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          Your inbox is costing you money
        </motion.h2>

        <motion.p
          className="text-secondary-foreground/80 max-w-[60ch] mb-16 text-base md:text-lg leading-[1.65]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 }}
        >
          Every hour a message sits unanswered, another client books somewhere else. Sound familiar?
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PROBLEMS.map(({ icon: Icon, title, firstLine, description }, i) => (
            <motion.div
              key={title}
              className="group relative p-6 lg:p-8 border border-border/50 bg-card rounded-[10px] shadow-subtle transition-all duration-200 ease-out hover:-translate-y-1 hover:border-border/70 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/[0.04] before:rounded-t-[10px]"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 + i * STAGGER_DELAY }}
            >
              <div className="w-14 h-14 flex items-center justify-center border border-border/50 bg-secondary rounded-[8px] mb-5">
                <Icon className="w-5 h-5 text-foreground/60" />
              </div>
              <h3 className="text-foreground font-medium text-lg mb-3">{title}</h3>
              <p className="text-sm text-secondary-foreground/70 leading-relaxed">
                <span className="font-medium text-foreground/90">{firstLine}</span>{' '}
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
