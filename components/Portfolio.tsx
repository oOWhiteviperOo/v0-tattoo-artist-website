'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { useStudio } from '@/lib/studio-context'

export function Portfolio() {
  const { portfolio, blurDataUrl } = useStudio()
  return (
    <section id="work" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl text-balance">
            {portfolio.sectionTitle}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {portfolio.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {portfolio.images.map((src, i) => {
            const isLarge = i === 0 || i === 3
            return (
              <div
                key={src}
                className={`relative overflow-hidden bg-secondary ${isLarge ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Tattoo portfolio piece ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  className="object-cover transition-[filter] duration-300 hover:brightness-110"
                />
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
