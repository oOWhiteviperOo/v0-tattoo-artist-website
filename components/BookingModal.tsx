'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useStudio } from '@/lib/studio-context'

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionTitle?: string
}

interface FormState {
  fullName: string
  email: string
  phone: string
  instagram: string
  sessionType: string
  preferredDate: string
  placement: string
  description: string
  agreed: boolean
}

const defaultForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  instagram: '',
  sessionType: '',
  preferredDate: '',
  placement: '',
  description: '',
  agreed: false,
}

export function BookingModal({ open, onOpenChange, sessionTitle }: BookingModalProps) {
  const { booking, sessions, identity } = useStudio()
  const [form, setForm] = useState<FormState>(defaultForm)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({})

  const update = (key: keyof FormState, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  // Pre-fill session type when opened from a session card
  useEffect(() => {
    if (open && sessionTitle) {
      setForm((prev) => ({ ...prev, sessionType: sessionTitle }))
    }
    if (!open) {
      // Reset after close animation
      const timeout = setTimeout(() => {
        setForm(defaultForm)
        setSubmitted(false)
        setIsSubmitting(false)
        setSubmitError(null)
        setErrors({})
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [open, sessionTitle])

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, boolean>> = {}
    if (!form.fullName.trim()) newErrors.fullName = true
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = true
    if (!form.sessionType) newErrors.sessionType = true
    if (!form.preferredDate) newErrors.preferredDate = true
    if (!form.placement.trim()) newErrors.placement = true
    if (!form.description.trim()) newErrors.description = true
    if (!form.agreed) newErrors.agreed = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError(null)
    setErrors({})

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form,
          studio: {
            slug: identity.slug,
            name: identity.name,
            artist: identity.artistName,
          }
        }),
      })

      if (!response.ok) throw new Error('Submission failed')

      setIsSubmitting(false)
      setSubmitted(true)
      setTimeout(() => {
        onOpenChange(false)
        setForm(defaultForm)
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)
      setSubmitError('Something went wrong. Please try again or contact the studio directly.')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const inputClass =
    'bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent rounded-none'
  const errorBorder = 'border-red-500/50'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card border-border rounded-none sm:max-w-lg">
        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Check className="h-8 w-8 text-accent" />
            </div>
            <p className="text-center font-sans text-lg font-semibold text-foreground">
              {booking.successTitle}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {booking.successMessage}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-sans text-lg font-bold uppercase tracking-wider text-accent">
                {booking.modalTitle}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {booking.modalDescription}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium uppercase tracking-wider text-dimmed">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className={`${inputClass} ${errors.fullName ? errorBorder : ''}`}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-dimmed">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={`${inputClass} ${errors.email ? errorBorder : ''}`}
                />
              </div>

              {/* Phone & Instagram */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-dimmed">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="instagram" className="text-xs font-medium uppercase tracking-wider text-dimmed">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    type="text"
                    placeholder="@yourhandle"
                    value={form.instagram}
                    onChange={(e) => update('instagram', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Session Type */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium uppercase tracking-wider text-dimmed">
                  Session Type <span className="text-red-400">*</span>
                </Label>
                <Select value={form.sessionType} onValueChange={(v) => update('sessionType', v)}>
                  <SelectTrigger className={`${inputClass} ${errors.sessionType ? errorBorder : ''}`}>
                    <SelectValue placeholder="Select a session type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {sessions.items.map((session) => (
                      <SelectItem key={session.title} value={session.title} className="text-foreground focus:bg-white/[0.06] focus:text-foreground">
                        {session.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="preferredDate" className="text-xs font-medium uppercase tracking-wider text-dimmed">
                  Preferred Date <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  min={today}
                  value={form.preferredDate}
                  onChange={(e) => update('preferredDate', e.target.value)}
                  className={`${inputClass} ${errors.preferredDate ? errorBorder : ''}`}
                />
              </div>

              {/* Placement */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="placement" className="text-xs font-medium uppercase tracking-wider text-dimmed">
                  Placement <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="placement"
                  type="text"
                  placeholder="e.g. Left forearm, upper back, full sleeve"
                  value={form.placement}
                  onChange={(e) => update('placement', e.target.value)}
                  className={`${inputClass} ${errors.placement ? errorBorder : ''}`}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-dimmed">
                  {'Description / References'} <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your idea, share reference images, or link a Pinterest board. The more detail, the better."
                  rows={6}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  className={`${inputClass} ${errors.description ? errorBorder : ''}`}
                />
              </div>

              {/* Agreement */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agreed"
                  checked={form.agreed}
                  onCheckedChange={(v) => update('agreed', v === true)}
                  className={`mt-0.5 border-border data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground ${errors.agreed ? 'border-red-500/50' : ''}`}
                />
                <Label htmlFor="agreed" className="text-xs leading-relaxed text-muted-foreground">
                  {booking.depositDisclaimer}
                </Label>
              </div>

              {/* Error Message */}
              {submitError && (
                <p className="text-sm text-red-400 text-center">{submitError}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full bg-accent py-3 font-sans text-sm font-bold uppercase tracking-wider text-accent-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-accent-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : `${booking.submitText} \u2192`}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
