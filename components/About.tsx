'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ABOUT_IMAGE, BLUR_DATA_URL } from '@/lib/constants'

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -40])

  return (
    <section ref={sectionRef} className="bg-[#0A0A0A] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl">
            The Artist
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
                src={ABOUT_IMAGE || "/placeholder.svg"}
                alt="Tattoo artist Raven Morales portrait"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
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
            <p className="text-lg leading-relaxed text-[#A1A1A1]">
              Raven Morales is a dark realism & blackwork specialist based in
              the Arts District of Los Angeles. With over 5 years of
              professional tattooing and 500+ completed pieces, his work blends
              fine art composition with the permanence of ink.
            </p>
            <p className="text-base leading-relaxed text-[#A1A1A1]">
              Every piece is custom-designed from scratch. No templates, no
              shortcuts. Raven works with each client to develop a concept that
              reflects their vision and his signature dark aesthetic.
            </p>
            <div className="border-l-2 border-[#C8A96E] pl-4">
              <p className="text-sm font-medium text-[#C8A96E]">
                All designs are custom. No flash work. No walk-ins. Serious
                clients only.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
