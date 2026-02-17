'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const FAQS = [
  {
    question: 'Do I need to change how I book?',
    answer:
      'No. We work around your existing process. If you book through DMs, we plug into that. If you use a form, we replace it with something faster. Nothing changes for you except fewer messages to answer.',
  },
  {
    question: 'Can you use my existing Instagram or DMs?',
    answer:
      'Yes. Our AI concierge handles enquiries through your website booking form. Instagram DM integration is available on the Pro plan and above \u2014 we route enquiries from your DMs straight into the booking system.',
  },
  {
    question: 'What if I have multiple artists?',
    answer:
      'We handle multi-artist studios on the Pro plan. Each artist gets their own calendar, availability, and booking flow. Enquiries are routed to the right person automatically based on style, availability, or your custom rules.',
  },
  {
    question: 'How fast is setup?',
    answer:
      'Your studio can be live within 48 hours. We build your custom booking page, connect your calendar and payments, and send you a working demo to test. You give feedback, we tweak it, and you\u2019re taking bookings the same week.',
  },
  {
    question: 'Can I cancel any time?',
    answer:
      'Yes. No contracts, no lock-in. Cancel any time from your dashboard or just send us an email. If you cancel mid-month, you keep access until the end of the billing period.',
  },
]

export function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-border/30 bg-secondary">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          Common questions
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-12 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          Everything you need to know
        </motion.h2>

        <motion.div
          className="max-w-[720px]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 }}
        >
          <Accordion type="single" collapsible>
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-border/30"
              >
                <AccordionTrigger className="text-foreground text-sm md:text-base font-medium hover:no-underline py-5 [&>svg]:text-muted-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-secondary-foreground/70 text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
