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
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -20])

  return (
    <section ref={sectionRef} className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl">
            {about.sectionTitle}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Image */}
          <motion.div
            className="relative aspect-[3/4] w-full overflow-hidden lg:w-1/2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                className="rounded-sm object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="flex flex-1 flex-col gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {about.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
            <div className="border-l border-border pl-6">
              <p className="text-base italic text-foreground/80 font-display">
                {about.callout}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
