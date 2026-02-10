'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQ_ITEMS } from '@/lib/constants'

export function FAQ() {
  return (
    <section id="faq" className="bg-[#0A0A0A] py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl text-balance">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <Accordion type="single" collapsible defaultValue="faq-1" className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-white/[0.06] bg-white/[0.03] px-6 backdrop-blur-xl transition-colors hover:border-[#C8A96E]/15 hover:bg-white/[0.06]"
              >
                <AccordionTrigger className="py-5 text-left font-sans text-base font-semibold text-[#C8A96E] hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-[#A1A1A1]">
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
