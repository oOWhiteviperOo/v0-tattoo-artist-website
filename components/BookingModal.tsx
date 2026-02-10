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

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionTitle?: string
}

const SESSION_OPTIONS = ['Flash Drop', 'Half-Day Session', 'Full-Day Session']

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
  const [form, setForm] = useState<FormState>(defaultForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({})

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    setTimeout(() => {
      onOpenChange(false)
    }, 3000)
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const inputClass =
    'bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#6B6B6B] focus:border-[#C8A96E] focus:ring-[#C8A96E] rounded-none'
  const errorBorder = 'border-red-500/50'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#141414] border-[#1F1F1F] rounded-none sm:max-w-lg">
        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C8A96E]/10">
              <Check className="h-8 w-8 text-[#C8A96E]" />
            </div>
            <p className="text-center font-sans text-lg font-semibold text-[#F5F5F5]">
              Request submitted.
            </p>
            <p className="text-center text-sm text-[#A1A1A1]">
              {"I'll be in touch within 48 hours."}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-sans text-lg font-bold uppercase tracking-wider text-[#C8A96E]">
                Request a Session
              </DialogTitle>
              <DialogDescription className="text-sm text-[#A1A1A1]">
                Fill out the details below. I{"'"}ll review your request and
                confirm your slot within 48 hours.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
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
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
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
                  <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
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
                  <Label htmlFor="instagram" className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
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
                <Label className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                  Session Type <span className="text-red-400">*</span>
                </Label>
                <Select value={form.sessionType} onValueChange={(v) => update('sessionType', v)}>
                  <SelectTrigger className={`${inputClass} ${errors.sessionType ? errorBorder : ''}`}>
                    <SelectValue placeholder="Select a session type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#1F1F1F]">
                    {SESSION_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-[#F5F5F5] focus:bg-white/[0.06] focus:text-[#F5F5F5]">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="preferredDate" className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
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
                <Label htmlFor="placement" className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
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
                <Label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
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
                  className={`mt-0.5 border-[#1F1F1F] data-[state=checked]:bg-[#C8A96E] data-[state=checked]:text-[#0A0A0A] ${errors.agreed ? 'border-red-500/50' : ''}`}
                />
                <Label htmlFor="agreed" className="text-xs leading-relaxed text-[#A1A1A1]">
                  I understand that a non-refundable deposit is required to
                  secure my session. Pricing and final details will be confirmed
                  before any payment is taken.
                </Label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 w-full bg-[#C8A96E] py-3 font-sans text-sm font-bold uppercase tracking-wider text-[#0A0A0A] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(200,169,110,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'Submit Request \u2192'}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
