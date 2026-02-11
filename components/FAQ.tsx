'use client'

import { motion } from 'motion/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useStudio } from '@/lib/studio-context'

export function FAQ() {
  const { faq } = useStudio()
  return (
    <section id="faq" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            {faq.sectionTitle}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <Accordion type="single" collapsible defaultValue="faq-1" className="flex flex-col gap-3">
            {faq.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-white/[0.06] bg-white/[0.03] px-6 backdrop-blur-xl transition-colors hover:border-accent/15 hover:bg-white/[0.06]"
              >
                <AccordionTrigger className="py-5 text-left font-sans text-base font-semibold text-accent hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
