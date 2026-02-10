'use client'

import { motion } from 'framer-motion'

export function FinalCTA({ onBookingOpen }: { onBookingOpen: () => void }) {
  return (
    <section className="relative bg-[#0A0A0A] py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* Gold line */}
        <div className="mx-auto mb-10 h-px w-16 bg-[#C8A96E]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-4xl font-extrabold uppercase tracking-tight text-[#F5F5F5] sm:text-5xl lg:text-6xl text-balance">
            Ready to Commit?
          </h2>
          <p className="mt-6 text-base text-[#A1A1A1] sm:text-lg">
            The creative process starts with one decision. Let{"'"}s create
            something permanent.
          </p>
          <button
            type="button"
            onClick={onBookingOpen}
            className="mt-10 inline-block bg-[#C8A96E] text-[#0A0A0A] px-10 py-4 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(200,169,110,0.25)]"
          >
            {'Book Your Slot \u2192'}
          </button>
        </motion.div>

        {/* Gold line */}
        <div className="mx-auto mt-10 h-px w-16 bg-[#C8A96E]" />
      </div>
    </section>
  )
}
