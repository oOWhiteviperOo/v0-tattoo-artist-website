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
    question: 'Does the AI give medical advice?',
    answer:
      'No. The system handles booking, scheduling, and deposits only. It never provides clinical advice, treatment recommendations, or medical information. Think of it as a receptionist, not a practitioner.',
  },
  {
    question: 'How does it work with my existing booking system?',
    answer:
      'We work around your current process. If you book through DMs, we handle that. If you use Fresha or another tool, we add a layer on top that responds instantly and collects deposits before the appointment.',
  },
  {
    question: 'What if I have multiple practitioners?',
    answer:
      'The Growth plan supports multi-practitioner clinics. Each practitioner gets their own calendar, availability, and treatment menu. Enquiries are routed automatically based on treatment type and availability.',
  },
  {
    question: 'How fast is setup?',
    answer:
      'Your clinic can be live within 48 hours. We configure your treatment menu, connect your calendar and payments, and send you a working demo to test. You give feedback, we tweak it, and you\u2019re taking bookings the same week.',
  },
  {
    question: 'Can I cancel any time?',
    answer:
      'Yes. No contracts, no lock-in. Cancel any time or just send us an email. If you cancel mid-month, you keep access until the end of the billing period.',
  },
]

export function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-hairline bg-secondary">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          Common questions
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-12 text-foreground"
          initial={{ y: 8 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          Everything you need to know
        </motion.h2>

        <motion.div
          className="max-w-[720px] border border-hairline bg-card rounded-[12px] p-6 lg:p-8"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 }}
        >
          <Accordion type="single" collapsible>
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-hairline"
              >
                <AccordionTrigger className="text-foreground text-sm md:text-base font-medium hover:no-underline py-6 [&>svg]:text-muted-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-secondary-foreground/70 text-sm leading-relaxed pb-6">
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
