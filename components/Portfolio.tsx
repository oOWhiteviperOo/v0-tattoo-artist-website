'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { useStudio } from '@/lib/studio-context'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function Portfolio() {
  const { portfolio, blurDataUrl } = useStudio()
  return (
    <section id="work" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            {portfolio.sectionTitle}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {portfolio.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {portfolio.images.map((src, i) => (
            <motion.div
              key={src}
              variants={itemVariants}
              className="group relative aspect-square overflow-hidden bg-white/[0.03]"
            >
              <Image
                src={src || "/placeholder.svg"}
                alt={`Tattoo portfolio piece ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={blurDataUrl}
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
