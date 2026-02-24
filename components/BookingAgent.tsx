'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, X, MessageSquare, Calendar, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { useStudio } from '@/lib/studio-context'

interface BookingAgentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studioSlug: string
  bookingRef?: string
  demoMode?: boolean
  onOpenForm?: () => void
}

interface SlotData {
  date: string
  time: string
  artistName?: string
}

interface MessageData {
  availableSlots?: SlotData[]
  depositUrl?: string
  bookingId?: string
  newDate?: string
  newTime?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  action?: string
  data?: MessageData
  annotation?: string
  timestamp: Date
}

interface DemoStep {
  action: string
  label: string
}

const MAX_TURNS = 20
const MAX_MESSAGE_LENGTH = 2000
const FETCH_TIMEOUT_MS = 10000
const MAX_RETRIES = 3

function generateSessionId(): string {
  return 'cs_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

function getAnnotation(action?: string): string | undefined {
  if (!action) return undefined
  const map: Record<string, string> = {
    book: 'In a live studio, this would check calendar availability and create a hold',
    deposit: 'In a live studio, a Stripe payment link would be generated here',
    show_deposit: 'In a live studio, a Stripe payment link would be generated here',
    calendar_hold: 'In a live studio, a real calendar hold would be created',
    booking_complete: 'In a live studio, the booking would be saved and an SMS sent to the client',
    faq: 'This FAQ response is generated from studio policy',
    escalate: 'In a live studio, this would be escalated to the studio owner via Slack',
  }
  return map[action] || undefined
}

async function fetchWithRetry(url: string, options: RequestInit, retries: number = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timeout)
      return res
    } catch (err) {
      clearTimeout(timeout)
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 500 * attempt))
    }
  }
  throw new Error('All retries exhausted')
}

export function BookingAgent({
  open,
  onOpenChange,
  studioSlug,
  bookingRef,
  demoMode = false,
  onOpenForm,
}: BookingAgentProps) {
  const { identity } = useStudio()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [turnCount, setTurnCount] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [extractedEntities, setExtractedEntities] = useState<Record<string, unknown>>({})
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const getGreeting = useCallback(() => {
    if (demoMode) {
      return "Try me out! Describe the tattoo you're thinking about and I'll show you how the booking process works."
    }
    if (bookingRef) {
      return `I can see your booking (ref: ${bookingRef}). Would you like to reschedule or cancel?`
    }
    return `Hi! I'm the booking assistant for ${identity.name}. Looking to book, reschedule, or cancel?`
  }, [demoMode, bookingRef, identity.name])

  // Initialise with opening message
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: 'opening',
        role: 'assistant',
        content: getGreeting(),
        timestamp: new Date(),
      }])
    }
  }, [open, messages.length, getGreeting])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Reset on close
  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setMessages([])
        setInput('')
        setIsLoading(false)
        setTurnCount(0)
        setCompleted(false)
        setExtractedEntities({})
        setDemoSteps([])
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [open])

  // Build conversation history (sliding window of last 10)
  const buildConversationHistory = useCallback(() => {
    return messages
      .filter(m => m.role !== 'system')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }))
  }, [messages])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading || completed) return
    if (trimmed.length > MAX_MESSAGE_LENGTH) return

    // 20-turn safety
    if (turnCount >= MAX_TURNS) {
      setMessages(prev => [...prev, {
        id: `limit-${Date.now()}`,
        role: 'assistant',
        content: 'We\'ve been chatting a while! Would you like to speak to someone directly, or try our booking form instead?',
        action: 'escalated',
        timestamp: new Date(),
      }])
      setCompleted(true)
      return
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setTurnCount(prev => prev + 1)

    try {
      const response = await fetchWithRetry(
        `/api/chat${demoMode ? '?demo=true' : ''}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            studioSlug,
            sessionId,
            turnCount: turnCount + 1,
            conversationHistory: buildConversationHistory(),
            extractedEntities,
            completed: false,
            ...(bookingRef ? { bookingRef } : {}),
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status}`)
      }

      const data = await response.json()

      // Merge extracted entities from response
      if (data.extractedEntities) {
        setExtractedEntities(prev => ({ ...prev, ...data.extractedEntities }))
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'Sorry, I couldn\'t process that. Please try again.',
        action: data.action || undefined,
        data: {
          availableSlots: data.availableSlots,
          depositUrl: data.depositUrl,
          bookingId: data.bookingId,
        },
        annotation: demoMode ? getAnnotation(data.action) : undefined,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMsg])

      // Track demo steps
      if (demoMode && data.action) {
        setDemoSteps(prev => [...prev, { action: data.action, label: data.actionLabel || data.action }])
      }

      // Handle completion actions
      if (data.action === 'booking_complete') {
        setCompleted(true)
        setTimeout(() => onOpenChange(false), 3000)
      } else if (data.action === 'escalated') {
        setCompleted(true)
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: onOpenForm
          ? 'Sorry, I\'m having trouble connecting. You can try our booking form instead.'
          : 'Sorry, something went wrong. Please try again in a moment.',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, completed, demoMode, turnCount, studioSlug, sessionId, buildConversationHistory, extractedEntities, bookingRef, onOpenForm, onOpenChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSlotClick = (slot: SlotData) => {
    setInput(`I'd like the ${slot.time} slot on ${slot.date}${slot.artistName ? ` with ${slot.artistName}` : ''}`)
    setTimeout(sendMessage, 50)
  }

  const handleFormFallback = () => {
    onOpenChange(false)
    onOpenForm?.()
  }

  // Render action-specific UI within a message
  const renderActionContent = (msg: Message) => {
    if (!msg.action || !msg.data) return null

    switch (msg.action) {
      case 'show_slots':
        if (!msg.data.availableSlots?.length) return null
        return (
          <div className="mt-2 space-y-1.5">
            {msg.data.availableSlots.map((slot, i) => (
              <button
                key={i}
                onClick={() => handleSlotClick(slot)}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md border border-border bg-background hover:border-accent hover:bg-accent/5 transition-colors text-xs"
              >
                <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="text-foreground font-medium">{slot.date} at {slot.time}</span>
                {slot.artistName && (
                  <span className="text-muted-foreground ml-auto">{slot.artistName}</span>
                )}
              </button>
            ))}
          </div>
        )

      case 'show_deposit':
        if (!msg.data.depositUrl) return null
        return (
          <div className="mt-2">
            <a
              href={msg.data.depositUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              Pay Deposit Now
            </a>
          </div>
        )

      case 'booking_complete':
        return (
          <div className="mt-2 flex items-center gap-2 text-accent text-xs">
            <CheckCircle2 className="h-4 w-4" />
            <span>Booking confirmed{msg.data.bookingId ? ` (ref: ${msg.data.bookingId})` : ''}</span>
          </div>
        )

      case 'cancelled':
        return (
          <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
            <CheckCircle2 className="h-4 w-4" />
            <span>Booking cancelled{msg.data.bookingId ? ` (ref: ${msg.data.bookingId})` : ''}</span>
          </div>
        )

      case 'rescheduled':
        return (
          <div className="mt-2 flex items-center gap-2 text-accent text-xs">
            <Calendar className="h-4 w-4" />
            <span>
              Rescheduled{msg.data.newDate ? ` to ${msg.data.newDate}` : ''}
              {msg.data.newTime ? ` at ${msg.data.newTime}` : ''}
            </span>
          </div>
        )

      case 'escalated':
        return (
          <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
            <AlertCircle className="h-4 w-4" />
            <span>A team member will be in touch shortly</span>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] h-[600px] bg-card border-border rounded sm:max-w-md p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-accent" />
            <span className="font-display text-sm text-foreground">
              {identity.name}
            </span>
            {demoMode && (
              <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-accent/10 text-accent border border-accent/20">
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {onOpenForm && !demoMode && (
              <button
                onClick={handleFormFallback}
                className="text-[11px] text-muted-foreground hover:text-accent transition-colors underline underline-offset-2"
              >
                Prefer a form?
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%]">
                <div
                  className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary/50 text-foreground border border-border'
                  }`}
                >
                  {msg.content}
                  {renderActionContent(msg)}
                </div>
                {msg.annotation && (
                  <p className="mt-1 text-[11px] text-muted-foreground/60 italic px-1">
                    {msg.annotation}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary/50 border border-border rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Demo completion summary */}
          {completed && demoMode && demoSteps.length > 0 && (
            <div className="border border-accent/20 rounded-lg p-3 bg-accent/5">
              <p className="text-xs font-medium text-accent mb-2">Demo Complete — Steps Performed:</p>
              <ul className="space-y-1">
                {demoSteps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-medium shrink-0">
                      {i + 1}
                    </span>
                    {step.label}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-muted-foreground/60">
                In a live studio, all of these steps would happen automatically.
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          {completed ? (
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                {demoMode ? 'Demo complete. Close this window to try again.' : 'Conversation complete.'}
              </p>
              {onOpenForm && !demoMode && (
                <button
                  onClick={handleFormFallback}
                  className="text-xs text-accent hover:text-accent/80 underline underline-offset-2 transition-colors"
                >
                  Open booking form
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  bookingRef
                    ? 'Cancel, reschedule, or ask a question...'
                    : demoMode
                      ? 'Describe your tattoo idea...'
                      : 'Type a message...'
                }
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={isLoading}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-all hover:bg-accent/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
