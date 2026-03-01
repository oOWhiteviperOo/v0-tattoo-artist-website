'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Send, X, MessageSquare, Calendar, CreditCard, CheckCircle2, AlertCircle, Lightbulb, Sparkles, HelpCircle, Check } from 'lucide-react'
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
  displayContent?: string
  action?: string
  data?: MessageData
  annotation?: string
  timestamp: Date
  streamComplete?: boolean
}

interface DemoStep {
  action: string
  label: string
}

interface SuggestionChip {
  text: string
  icon: 'sparkles' | 'help' | 'calendar'
}

const MAX_TURNS = 20
const MAX_MESSAGE_LENGTH = 2000
const FETCH_TIMEOUT_MS = 10000
const MAX_RETRIES = 3
const WORDS_PER_TICK = 2
const TICK_INTERVAL_MS = 30

const DEMO_SUGGESTIONS_TATTOO: SuggestionChip[] = [
  { text: "I want a Japanese sleeve on my forearm", icon: 'sparkles' },
  { text: "How much for a small tattoo?", icon: 'help' },
  { text: "I need to cancel a booking", icon: 'calendar' },
]

const DEMO_SUGGESTIONS_AESTHETICS: SuggestionChip[] = [
  { text: "How much for lip filler?", icon: 'sparkles' },
  { text: "Do you do Botox?", icon: 'help' },
  { text: "I need to cancel my appointment", icon: 'calendar' },
]

const BOOKING_SUGGESTIONS_TATTOO: SuggestionChip[] = [
  { text: "I'd like to book a session", icon: 'sparkles' },
  { text: "What styles do you do?", icon: 'help' },
  { text: "I need to reschedule", icon: 'calendar' },
]

const BOOKING_SUGGESTIONS_AESTHETICS: SuggestionChip[] = [
  { text: "I'd like to book a treatment", icon: 'sparkles' },
  { text: "What treatments do you offer?", icon: 'help' },
  { text: "I need to reschedule", icon: 'calendar' },
]

const FLOW_STEPS = ['Describe', 'Availability', 'Deposit', 'Confirmed'] as const

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

function getThinkingText(lastMessage: string): string {
  const lower = lastMessage.toLowerCase()
  if (/book|session|appointment|available/.test(lower)) return 'Checking availability...'
  if (/cancel/.test(lower)) return 'Looking up your booking...'
  if (/reschedul|change|move/.test(lower)) return 'Finding new times...'
  if (/how much|price|cost|£/.test(lower)) return 'Pulling up pricing...'
  if (/faq|question|policy|aftercare/.test(lower)) return 'Searching studio info...'
  return 'Thinking...'
}

function getStepIcon(action: string) {
  switch (action) {
    case 'show_slots': case 'book': case 'calendar_hold': return Calendar
    case 'show_deposit': case 'deposit': return CreditCard
    case 'booking_complete': return CheckCircle2
    case 'faq': return MessageSquare
    case 'escalate': return AlertCircle
    default: return CheckCircle2
  }
}

function ChipIcon({ type }: { type: SuggestionChip['icon'] }) {
  switch (type) {
    case 'sparkles': return <Sparkles className="h-3 w-3 shrink-0 text-accent/60" />
    case 'help': return <HelpCircle className="h-3 w-3 shrink-0 text-accent/60" />
    case 'calendar': return <Calendar className="h-3 w-3 shrink-0 text-accent/60" />
  }
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
  const config = useStudio()
  const { identity } = config
  const isAesthetics = config.vertical === 'aesthetics'
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [turnCount, setTurnCount] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [extractedEntities, setExtractedEntities] = useState<Record<string, unknown>>({})
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [lastUserMessage, setLastUserMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<number | null>(null)

  // Derive demo progress step from actions
  const currentFlowStep = useMemo(() => {
    const actions = demoSteps.map(s => s.action)
    if (actions.includes('booking_complete')) return 3
    if (actions.includes('show_deposit') || actions.includes('deposit') || actions.includes('calendar_hold')) return 2
    if (actions.includes('show_slots') || actions.includes('book')) return 1
    return 0
  }, [demoSteps])

  const getGreeting = useCallback(() => {
    if (demoMode) {
      return isAesthetics
        ? `Hey! I handle bookings for ${identity.name} — 24 hours a day, every day. Ask me about treatments, availability, or pricing.`
        : `Hey! I'm the AI that handles bookings for ${identity.name} — 24 hours a day, every day. Try describing a tattoo idea and watch the magic happen.`
    }
    if (bookingRef) {
      return `I can see your booking (ref: ${bookingRef}). Would you like to reschedule or cancel?`
    }
    return isAesthetics
      ? `Hey! I can help you book a treatment, check availability, or answer questions about ${identity.name}. What are you looking for?`
      : `Hey! I can help you book a session, check availability, or answer questions about ${identity.name}. What are you looking for?`
  }, [demoMode, bookingRef, identity.name, isAesthetics])

  // Initialise with opening message
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: 'opening',
        role: 'assistant',
        content: getGreeting(),
        streamComplete: true,
        timestamp: new Date(),
      }])
    }
  }, [open, messages.length, getGreeting])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingMessageId])

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
        setShowSuggestions(true)
        setStreamingMessageId(null)
        setLastUserMessage('')
        if (streamRef.current) cancelAnimationFrame(streamRef.current)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [open])

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) cancelAnimationFrame(streamRef.current)
    }
  }, [])

  // Stream text word by word
  const startStreaming = useCallback((messageId: string, fullText: string, onComplete: () => void) => {
    const words = fullText.split(/(\s+)/)
    let wordIndex = 0
    let lastTime = 0

    setStreamingMessageId(messageId)

    const tick = (time: number) => {
      if (time - lastTime >= TICK_INTERVAL_MS) {
        wordIndex += WORDS_PER_TICK
        const revealed = words.slice(0, Math.min(wordIndex, words.length)).join('')

        setMessages(prev => prev.map(m =>
          m.id === messageId ? { ...m, displayContent: revealed } : m
        ))

        lastTime = time

        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }

      if (wordIndex < words.length) {
        streamRef.current = requestAnimationFrame(tick)
      } else {
        setMessages(prev => prev.map(m =>
          m.id === messageId ? { ...m, displayContent: fullText, streamComplete: true } : m
        ))
        setStreamingMessageId(null)
        onComplete()
      }
    }

    streamRef.current = requestAnimationFrame(tick)
  }, [])

  // Build conversation history (sliding window of last 10)
  const buildConversationHistory = useCallback(() => {
    return messages
      .filter(m => m.role !== 'system')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }))
  }, [messages])

  const sendMessage = useCallback(async (overrideInput?: string) => {
    const trimmed = (overrideInput || input).trim()
    if (!trimmed || isLoading || completed || streamingMessageId) return
    if (trimmed.length > MAX_MESSAGE_LENGTH) return

    setShowSuggestions(false)
    setLastUserMessage(trimmed)

    // 20-turn safety
    if (turnCount >= MAX_TURNS) {
      setMessages(prev => [...prev, {
        id: `limit-${Date.now()}`,
        role: 'assistant',
        content: 'We\'ve been chatting a while! Would you like to speak to someone directly, or try our booking form instead?',
        action: 'escalated',
        streamComplete: true,
        timestamp: new Date(),
      }])
      setCompleted(true)
      return
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      streamComplete: true,
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

      if (data.extractedEntities) {
        setExtractedEntities(prev => ({ ...prev, ...data.extractedEntities }))
      }

      const msgId = `assistant-${Date.now()}`
      const fullContent = data.response || 'Sorry, I couldn\'t process that. Please try again.'

      const assistantMsg: Message = {
        id: msgId,
        role: 'assistant',
        content: fullContent,
        displayContent: '',
        action: data.action || undefined,
        data: {
          availableSlots: data.availableSlots,
          depositUrl: data.depositUrl,
          bookingId: data.bookingId,
        },
        annotation: demoMode ? getAnnotation(data.action) : undefined,
        streamComplete: false,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMsg])
      setIsLoading(false)

      if (demoMode && data.action) {
        setDemoSteps(prev => [...prev, { action: data.action, label: data.actionLabel || data.action }])
      }

      startStreaming(msgId, fullContent, () => {
        if (data.action === 'booking_complete') {
          setCompleted(true)
          if (!demoMode) {
            setTimeout(() => onOpenChange(false), 3000)
          }
        } else if (data.action === 'escalated') {
          setCompleted(true)
        }
      })
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: onOpenForm
          ? 'Sorry, I\'m having trouble connecting. You can try our booking form instead.'
          : 'Sorry, something went wrong. Please try again in a moment.',
        streamComplete: true,
        timestamp: new Date(),
      }])
      setIsLoading(false)
    }
  }, [input, isLoading, completed, demoMode, turnCount, studioSlug, sessionId, buildConversationHistory, extractedEntities, bookingRef, onOpenForm, onOpenChange, streamingMessageId, startStreaming])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSlotClick = (slot: SlotData) => {
    const msg = `I'd like the ${slot.time} slot on ${slot.date}${slot.artistName ? ` with ${slot.artistName}` : ''}`
    sendMessage(msg)
  }

  const handleChipClick = (text: string) => {
    setShowSuggestions(false)
    sendMessage(text)
  }

  const handleFormFallback = () => {
    onOpenChange(false)
    onOpenForm?.()
  }

  const renderActionContent = (msg: Message) => {
    if (!msg.action || !msg.data || !msg.streamComplete) return null

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

  const suggestions = demoMode
    ? (isAesthetics ? DEMO_SUGGESTIONS_AESTHETICS : DEMO_SUGGESTIONS_TATTOO)
    : (isAesthetics ? BOOKING_SUGGESTIONS_AESTHETICS : BOOKING_SUGGESTIONS_TATTOO)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] h-[600px] bg-card border-border rounded sm:max-w-md p-0 gap-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 data-[state=open]:duration-300">
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

        {/* Progress breadcrumbs — demo mode only */}
        {demoMode && (
          <div className="flex items-center justify-between px-6 py-2 border-b border-border/50 shrink-0">
            {FLOW_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-0.5">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium transition-all duration-500 ${
                    i < currentFlowStep
                      ? 'bg-accent text-accent-foreground'
                      : i === currentFlowStep
                        ? 'bg-accent/20 text-accent border border-accent/40'
                        : 'bg-secondary text-muted-foreground/40 border border-border'
                  }`}>
                    {i < currentFlowStep ? <Check className="h-2.5 w-2.5" /> : i + 1}
                  </div>
                  <span className={`text-[9px] transition-colors duration-300 ${
                    i <= currentFlowStep ? 'text-accent' : 'text-muted-foreground/30'
                  }`}>
                    {step}
                  </span>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="flex-1 mx-1 mb-3">
                    <div className="h-px bg-border relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-accent transition-all duration-700 ease-out"
                        style={{ width: i < currentFlowStep ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div className="max-w-[85%]">
                <div
                  className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary/50 text-foreground border border-border'
                  }`}
                >
                  {msg.displayContent !== undefined ? msg.displayContent : msg.content}
                  {msg.id === streamingMessageId && (
                    <span className="inline-block w-0.5 h-4 bg-accent/60 ml-0.5 animate-pulse align-text-bottom" />
                  )}
                  {renderActionContent(msg)}
                </div>
                {msg.annotation && msg.streamComplete && (
                  <div className="mt-1.5 flex gap-2 items-start px-2 py-1.5 rounded-r-md bg-accent/5 border-l-2 border-accent/30 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <Lightbulb className="h-3 w-3 text-accent/60 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                      {msg.annotation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Suggestion chips */}
          {showSuggestions && !isLoading && !streamingMessageId && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 px-1 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(s.text)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-foreground/70 hover:bg-accent/10 hover:border-accent/40 hover:text-foreground transition-all duration-200"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <ChipIcon type={s.icon} />
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Contextual typing indicator */}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="bg-secondary/50 border border-border rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs thinking-shimmer">{getThinkingText(lastUserMessage)}</span>
              </div>
            </div>
          )}

          {/* Demo completion summary — timeline style */}
          {completed && demoMode && demoSteps.length > 0 && (
            <div className="border border-accent/20 rounded-lg p-4 bg-accent/5 shadow-[0_0_20px_hsl(var(--accent)/0.05)] animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <p className="text-sm font-medium text-accent">Demo Complete</p>
              </div>
              <div className="space-y-0 ml-1">
                {demoSteps.map((step, i) => {
                  const StepIcon = getStepIcon(step.action)
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
                          <StepIcon className="h-3 w-3 text-accent" />
                        </div>
                        {i < demoSteps.length - 1 && (
                          <div className="w-px h-4 bg-accent/20" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">{step.label}</p>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-accent/10">
                <p className="text-xs text-foreground/80 font-medium">
                  This runs 24/7 for your {isAesthetics ? 'clinic' : 'studio'}. Zero setup from you.
                </p>
                <p className="text-[11px] text-muted-foreground/50 mt-1">
                  Every step above happens automatically — bookings, deposits, reminders, all of it.
                </p>
              </div>
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
                      ? (isAesthetics ? 'Ask about treatments, prices, or availability...' : 'Describe your tattoo idea...')
                      : 'Type a message...'
                }
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={isLoading || !!streamingMessageId}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent focus:shadow-[0_0_0_3px_hsl(var(--accent)/0.1)] disabled:opacity-50 transition-shadow"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim() || !!streamingMessageId}
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
