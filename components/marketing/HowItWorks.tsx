'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

const STEPS = [
  {
    step: '01',
    title: 'We set up your AI receptionist',
    description:
      'A booking page built around your clinic \u2014 your treatments, your branding, a booking form that works 24/7. Live in 48 hours.',
    chip: 'Replies in <60s',
  },
  {
    step: '02',
    title: 'AI handles every enquiry',
    description:
      'Someone asks about lip filler at midnight. The system responds, checks your diary, sends a deposit link, confirms the booking. Under 60 seconds.',
    chip: 'Deposits collected',
  },
  {
    step: '03',
    title: 'You focus on your patients',
    description:
      'Reminders go out automatically. Deposits land before the appointment. Your treatment rooms stay full. We handle the admin.',
    chip: 'No-shows drop',
  },
]

function PhoneMockup() {
  return (
    <div className="relative w-[280px]">
      <div className="rounded-[36px] border-[6px] border-foreground/90 bg-foreground/95 p-2 shadow-elevated">
        {/* Notch */}
        <div className="mx-auto w-24 h-5 bg-foreground/90 rounded-b-2xl mb-2" />
        {/* Screen */}
        <div className="bg-white rounded-[28px] overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between px-4 py-2 text-[10px] text-gray-500">
            <span>21:14</span>
            <span>5G</span>
          </div>
          {/* DM header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
            <span className="text-xs font-semibold text-gray-900">glow.aesthetics</span>
          </div>
          {/* Messages */}
          <div className="px-4 py-4 space-y-3 min-h-[320px]">
            {/* Step 01: Incoming DM */}
            <div className="flex items-start gap-1.5 justify-end">
              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-accent/10 text-accent text-[9px] font-bold mt-0.5">01</span>
              <div className="bg-blue-500 text-white text-xs px-3 py-2 rounded-2xl rounded-br-md max-w-[170px]">
                Hey! Do you do lip filler?
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-right">9:14 PM</p>

            {/* Step 02: AI Reply */}
            <div className="flex items-start gap-1.5 justify-start">
              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-accent/10 text-accent text-[9px] font-bold mt-0.5">02</span>
              <div className="bg-gray-100 text-gray-900 text-xs px-3 py-2 rounded-2xl rounded-bl-md max-w-[190px]">
                Hi! Yes we offer lip filler. I can check availability for you right now. When works best?
              </div>
            </div>
            <p className="text-[10px] text-gray-400">9:14 PM &middot; AI Assistant</p>

            {/* Step 03: Confirmation */}
            <div className="flex items-start gap-1.5 justify-start">
              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-accent/10 text-accent text-[9px] font-bold mt-0.5">03</span>
              <div className="bg-green-50 border border-green-200 text-gray-900 text-xs px-3 py-2 rounded-2xl rounded-bl-md max-w-[190px]">
                <p className="font-semibold text-green-700 mb-1">Booking Confirmed</p>
                <p>Lip Filler &middot; Thu 2pm</p>
                <p className="text-green-600 mt-1">Deposit: &pound;50 paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 lg:py-32 px-4 border-t border-hairline">
      <div className="max-w-content mx-auto">
        <motion.p
          className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          initial={{ y: 6 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE }}
        >
          How it works
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-16 text-foreground"
          initial={{ y: 8 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
        >
          Three steps. Zero effort from you.
        </motion.h2>

        <div className="grid lg:grid-cols-[1fr,auto] gap-12 lg:gap-16 items-center">
          {/* Left: Steps */}
          <div className="relative">
            {/* Vertical connecting rail */}
            <motion.div
              className="absolute left-[23px] top-0 bottom-0 w-px bg-accent/20 hidden md:block"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: STAGGER_DELAY * 2 }}
              style={{ transformOrigin: 'top' }}
            />

            <div className="flex flex-col gap-14 md:gap-20">
              {STEPS.map(({ step, title, description, chip }, i) => (
                <motion.div
                  key={step}
                  className="relative flex gap-6 md:gap-10 items-start"
                  initial={{ y: 8 }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 + i * STAGGER_DELAY * 2 }}
                >
                  {/* Step number */}
                  <div className="relative shrink-0 w-12 h-12 flex items-center justify-center border border-accent/30 bg-accent/[0.06] rounded-[8px] z-10">
                    <span className="text-accent font-display text-2xl md:text-3xl">{step}</span>
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h3 className="text-foreground font-medium text-lg md:text-xl mb-2">{title}</h3>
                    <p className="text-secondary-foreground/70 text-sm md:text-base leading-relaxed max-w-[55ch]">
                      {description}
                    </p>
                    <span className="inline-block mt-3 px-3 py-1 bg-accent/[0.08] text-accent rounded text-xs font-medium">
                      {chip}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ x: 24 }}
            animate={inView ? { x: 0 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: STAGGER_DELAY * 4 }}
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
