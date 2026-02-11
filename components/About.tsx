'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { useStudio } from '@/lib/studio-context'

export function About() {
  const { about, blurDataUrl } = useStudio()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -40])

  return (
    <section ref={sectionRef} className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {about.sectionTitle}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Image */}
          <motion.div
            className="relative aspect-[3/4] w-full overflow-hidden lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              className="relative h-full w-full"
              style={{ y: yParallax }}
            >
              <Image
                src={about.image || "/placeholder.svg"}
                alt={about.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={blurDataUrl}
                className="rounded-lg object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="flex flex-1 flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            {about.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
            <div className="border-l-2 border-accent pl-4">
              <p className="text-sm font-medium text-accent">
                {about.callout}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
