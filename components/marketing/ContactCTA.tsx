'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import { GrainOverlay } from '@/components/GrainOverlay'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { EASE, STAGGER_DELAY } from '@/lib/marketing-motion'

export function ContactCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      studioName: (form.elements.namedItem('studioName') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong')
      }

      setFormState('success')
      form.reset()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setFormState('error')
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 lg:py-32 px-4 border-t border-border/30 overflow-hidden bg-secondary">
      {/* Background image */}
      <div className="absolute inset-0 vignette">
        <Image
          src="https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=1600&h=900&fit=crop&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/95 to-secondary/80" />
        <GrainOverlay opacity={0.06} />
      </div>

      <div className="relative z-10 max-w-content mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — Copy */}
          <div>
            <motion.p
              className="text-muted-foreground text-xs font-semibold tracking-[0.1em] uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.22, ease: EASE }}
            >
              Get started
            </motion.p>

            <motion.h2
              className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY }}
            >
              Ready to stop playing receptionist?
            </motion.h2>

            <motion.p
              className="text-secondary-foreground/80 text-base md:text-lg leading-[1.65] mb-8 max-w-[55ch]"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 2 }}
            >
              We&apos;ll build you a free demo site. No commitment, no setup fee, no catch.
              Just tell us your studio name and we&apos;ll show you what it looks like.
            </motion.p>

            <motion.div
              className="text-sm text-muted-foreground space-y-2"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 }}
            >
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
                Free demo site in 24 hours
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
                No credit card required
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
                14-day free trial
              </p>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.22, ease: EASE, delay: STAGGER_DELAY * 3 }}
          >
            {formState === 'success' ? (
              <div className="border border-accent/30 bg-card p-8 text-center rounded-[10px]">
                <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="text-foreground font-medium text-lg mb-2">We&apos;ll be in touch</h3>
                <p className="text-sm text-muted-foreground">
                  Keep an eye on your inbox. We usually respond within a few hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-border/50 bg-card rounded-[10px] p-6 lg:p-8 space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm text-foreground/80 mb-1.5">
                    Your name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Jay"
                    className="w-full bg-background/50 border border-border/50 rounded-[6px] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/80 focus:shadow-[inset_0_0_8px_rgba(216,162,74,0.12)] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm text-foreground/80 mb-1.5">
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="jay@studio.com"
                    className="w-full bg-background/50 border border-border/50 rounded-[6px] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/80 focus:shadow-[inset_0_0_8px_rgba(216,162,74,0.12)] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-studio" className="block text-sm text-foreground/80 mb-1.5">
                    Studio name
                  </label>
                  <input
                    id="contact-studio"
                    name="studioName"
                    type="text"
                    placeholder="Ink & Iron"
                    className="w-full bg-background/50 border border-border/50 rounded-[6px] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/80 focus:shadow-[inset_0_0_8px_rgba(216,162,74,0.12)] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm text-foreground/80 mb-1.5">
                    Anything else?
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    placeholder="Tell us about your studio..."
                    className="w-full bg-background/50 border border-border/50 rounded-[6px] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/80 focus:shadow-[inset_0_0_8px_rgba(216,162,74,0.12)] transition-all resize-none"
                  />
                </div>

                {formState === 'error' && (
                  <p className="text-sm text-destructive">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-[80%] mx-auto flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 text-sm font-medium rounded-[8px] transition-all duration-200 hover:bg-accent-hover hover:shadow-glow active:translate-y-[1px] active:bg-accent-pressed disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Get Your Free Demo
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground/60 text-center">
                  Or email us directly at{' '}
                  <a href="mailto:hello@apexink.uk" className="text-foreground/60 hover:text-foreground underline underline-offset-2 transition-colors">
                    hello@apexink.uk
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
