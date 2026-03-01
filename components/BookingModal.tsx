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
  treatmentArea: string
  previousTreatments: string
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
  treatmentArea: '',
  previousTreatments: '',
  agreed: false,
}

const TREATMENT_AREAS = [
  'Lips',
  'Forehead',
  'Cheeks',
  'Jawline',
  'Under-eye',
  'Full face',
  'Neck',
  'Other',
]

export function BookingModal({ open, onOpenChange, sessionTitle }: BookingModalProps) {
  const config = useStudio()
  const { booking, sessions, identity } = config
  const isAesthetics = config.vertical === 'aesthetics'
  const treatmentMenu = config.treatments?.menu ?? []
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
    if (isAesthetics) {
      if (!form.treatmentArea) newErrors.treatmentArea = true
    } else {
      if (!form.placement.trim()) newErrors.placement = true
      if (!form.description.trim()) newErrors.description = true
    }
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
          vertical: config.vertical || 'tattoo',
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
    'bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent rounded-sm'
  const errorBorder = 'border-red-500/50'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card border-border rounded sm:max-w-lg">
        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Check className="h-8 w-8 text-accent" />
            </div>
            <p className="text-center font-display text-lg text-foreground">
              {booking.successTitle}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {booking.successMessage}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-normal text-foreground">
                {booking.modalTitle}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {booking.modalDescription}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium text-muted-foreground">
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
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
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
                  <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07700 900000"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="instagram" className="text-xs font-medium text-muted-foreground">
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

              {/* Session / Treatment Type */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  {isAesthetics ? 'Treatment Type' : 'Session Type'} <span className="text-red-400">*</span>
                </Label>
                <Select value={form.sessionType} onValueChange={(v) => update('sessionType', v)}>
                  <SelectTrigger className={`${inputClass} ${errors.sessionType ? errorBorder : ''}`}>
                    <SelectValue placeholder={isAesthetics ? 'Select a treatment' : 'Select a session type'} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {isAesthetics
                      ? treatmentMenu.map((t) => (
                          <SelectItem key={t.slug} value={t.name} className="text-foreground focus:bg-secondary focus:text-foreground">
                            {t.name} {t.priceRange ? `(${t.priceRange})` : ''}
                          </SelectItem>
                        ))
                      : sessions.items.map((session) => (
                          <SelectItem key={session.title} value={session.title} className="text-foreground focus:bg-secondary focus:text-foreground">
                            {session.title}
                          </SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="preferredDate" className="text-xs font-medium text-muted-foreground">
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

              {isAesthetics ? (
                <>
                  {/* Treatment Area */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Treatment Area <span className="text-red-400">*</span>
                    </Label>
                    <Select value={form.treatmentArea} onValueChange={(v) => update('treatmentArea', v)}>
                      <SelectTrigger className={`${inputClass} ${errors.treatmentArea ? errorBorder : ''}`}>
                        <SelectValue placeholder="Select treatment area" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {TREATMENT_AREAS.map((area) => (
                          <SelectItem key={area} value={area} className="text-foreground focus:bg-secondary focus:text-foreground">
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Previous Treatments */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Have you had this treatment before?
                    </Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                        <input
                          type="radio"
                          name="previousTreatments"
                          value="first-time"
                          checked={form.previousTreatments === 'first-time'}
                          onChange={(e) => update('previousTreatments', e.target.value)}
                          className="accent-[hsl(var(--accent))]"
                        />
                        First time
                      </label>
                      <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                        <input
                          type="radio"
                          name="previousTreatments"
                          value="returning"
                          checked={form.previousTreatments === 'returning'}
                          onChange={(e) => update('previousTreatments', e.target.value)}
                          className="accent-[hsl(var(--accent))]"
                        />
                        Returning client
                      </label>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">
                      Additional notes
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Any allergies, medications, or specific concerns you'd like us to know about."
                      rows={3}
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Placement */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="placement" className="text-xs font-medium text-muted-foreground">
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
                    <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">
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
                </>
              )}

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
                className="mt-2 w-full bg-accent py-3 font-sans text-sm font-medium text-accent-foreground rounded transition-all duration-200 hover:bg-accent/90 hover:shadow-subtle active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : booking.submitText}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
