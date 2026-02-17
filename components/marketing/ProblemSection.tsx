'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { MessageSquare, Clock, CreditCard } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

const PROBLEMS = [
  {
    icon: MessageSquare,
    title: 'Your inbox is a warzone',
    description:
      'Booking requests mixed in with memes, spam, and "how much for a small one?" DMs. Stuff gets missed. People move on.',
  },
  {
    icon: Clock,
    title: 'Admin is eating your day',
    description:
      "Back-and-forth messages, checking your calendar, chasing deposits. You didn\u2019t pick up a machine to become a receptionist.",
  },
  {
    icon: CreditCard,
    title: 'No-shows are burning your money',
    description:
      "No deposit, no commitment. People book and ghost. Empty chairs don\u2019t pay rent.",
  },
]

export function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="problem" ref={sectionRef} className="py-24 lg:py-32 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          The problem
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          Your inbox is costing you money
        </motion.h2>

        <motion.p
          className="text-muted-foreground max-w-xl mb-16 text-base md:text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        >
          Every hour a message sits unanswered, another client books somewhere else. Sound familiar?
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PROBLEMS.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              className="group relative p-6 lg:p-8 border border-border/50 bg-card/30 transition-colors duration-300 hover:border-accent/20 hover:bg-card/60"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.12 }}
            >
              <div className="w-10 h-10 flex items-center justify-center border border-accent/20 bg-accent/5 mb-5">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-foreground font-medium text-lg mb-3">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
