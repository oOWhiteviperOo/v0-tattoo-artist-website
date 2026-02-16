'use client'

import { motion } from 'motion/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useStudio } from '@/lib/studio-context'

export function FAQ() {
  const { faq } = useStudio()
  return (
    <section id="faq" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl text-balance">
            {faq.sectionTitle}
          </h2>
        </motion.div>

        <Accordion type="single" collapsible defaultValue="faq-1" className="flex flex-col gap-0">
          {faq.items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-b border-border px-0 transition-colors"
            >
              <AccordionTrigger className="py-5 text-left font-sans text-base font-medium text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
