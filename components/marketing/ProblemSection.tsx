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
    <section id="problem" ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-hairline bg-secondary">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          The problem
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
          initial={{ y: 8 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          Your inbox is costing you money
        </motion.h2>

        <motion.p
          className="text-secondary-foreground/80 max-w-[60ch] mb-16 text-base md:text-lg leading-[1.65]"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 }}
        >
          Every hour a message sits unanswered, another client books somewhere else. Sound familiar?
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PROBLEMS.map(({ icon: Icon, title, firstLine, description }, i) => (
            <motion.div
              key={title}
              className="group relative p-6 lg:p-8 border border-hairline bg-card rounded-[10px] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/20"
              initial={{ y: 8 }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 + i * STAGGER_DELAY }}
            >
              <div className="w-16 h-16 flex items-center justify-center bg-foreground/[0.06] rounded-[10px] mb-5">
                <Icon className="w-7 h-7 text-foreground/70" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-3">{title}</h3>
              <p className="text-sm text-secondary-foreground/70 leading-relaxed">
                <span className="font-medium text-foreground/90">{firstLine}</span>{' '}
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cost callout strip */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-3 py-4 px-6 border border-hairline bg-card rounded-[10px] text-center"
          initial={{ y: 8 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 7 }}
        >
          <CreditCard className="w-5 h-5 text-foreground/70 shrink-0" />
          <p className="text-sm text-foreground font-medium">
            1 missed appointment per month = <span className="text-accent font-semibold">&pound;200+ lost</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
