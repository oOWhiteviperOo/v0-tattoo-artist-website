'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import { GrainOverlay } from '@/components/GrainOverlay'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

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
    <section id="contact" ref={sectionRef} className="relative py-24 lg:py-32 px-6 border-t border-border/30 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=1600&h=900&fit=crop&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
        <GrainOverlay opacity={0.03} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — Copy */}
          <div>
            <motion.p
              className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Get started
            </motion.p>

            <motion.h2
              className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 text-foreground"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            >
              Ready to stop playing receptionist?
            </motion.h2>

            <motion.p
              className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-md"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            >
              We&apos;ll build you a free demo site. No commitment, no setup fee, no catch.
              Just tell us your studio name and we&apos;ll show you what it looks like.
            </motion.p>

            <motion.div
              className="text-sm text-muted-foreground space-y-2"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
            >
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent/60" />
                Free demo site in 24 hours
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent/60" />
                No credit card required
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent/60" />
                14-day free trial
              </p>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          >
            {formState === 'success' ? (
              <div className="border border-accent/30 bg-card/50 p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="text-foreground font-medium text-lg mb-2">We&apos;ll be in touch</h3>
                <p className="text-sm text-muted-foreground">
                  Keep an eye on your inbox. We usually respond within a few hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-border/50 bg-card/40 p-6 lg:p-8 space-y-5">
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
                    className="w-full bg-background/50 border border-border/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
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
                    className="w-full bg-background/50 border border-border/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
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
                    className="w-full bg-background/50 border border-border/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
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
                    className="w-full bg-background/50 border border-border/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                  />
                </div>

                {formState === 'error' && (
                  <p className="text-sm text-destructive">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 text-sm font-medium transition-all duration-200 hover:bg-accent/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
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
                  <a href="mailto:hello@apexink.uk" className="text-accent/60 hover:text-accent transition-colors">
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
