'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, X, MessageSquare } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { useStudio } from '@/lib/studio-context'

interface BookingAgentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studioSlug: string
  demoMode?: boolean
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  annotation?: string
  timestamp: Date
}

interface DemoStep {
  action: string
  label: string
}

const DEMO_OPENING =
  "Try me out! Describe the tattoo you're thinking about and I'll show you how the booking process works."

const MAX_DEMO_TURNS = 20
const MAX_MESSAGE_LENGTH = 500

function generateSessionId(): string {
  return 'ds_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

// Map n8n action fields to friendly annotations
function getAnnotation(action?: string): string | undefined {
  if (!action) return undefined
  const map: Record<string, string> = {
    book: 'In a live studio, this would check calendar availability and create a hold',
    deposit: 'In a live studio, a Stripe payment link would be generated here',
    calendar_hold: 'In a live studio, a real calendar hold would be created',
    booking_complete: 'In a live studio, the booking would be saved and an SMS sent to the client',
    faq: 'This FAQ response is generated from studio policy',
    escalate: 'In a live studio, this would be escalated to the studio owner via Slack',
  }
  return map[action] || undefined
}

export function BookingAgent({ open, onOpenChange, studioSlug, demoMode = false }: BookingAgentProps) {
  const { identity } = useStudio()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [turnCount, setTurnCount] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialise with opening message
  useEffect(() => {
    if (open && messages.length === 0) {
      const opening: Message = {
        id: 'opening',
        role: 'assistant',
        content: demoMode ? DEMO_OPENING : `Hi! I'm the booking assistant for ${identity.name}. How can I help you today?`,
        timestamp: new Date(),
      }
      setMessages([opening])
    }
  }, [open, messages.length, demoMode, identity.name])

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
        setDemoSteps([])
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [open])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading || completed) return
    if (trimmed.length > MAX_MESSAGE_LENGTH) return

    if (demoMode && turnCount >= MAX_DEMO_TURNS) {
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
      const response = await fetch(`/api/chat${demoMode ? '?demo=true' : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          studioSlug,
          sessionId,
          turnCount: turnCount + 1,
          completed: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status}`)
      }

      const data = await response.json()

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || data.message || 'Sorry, I couldn\'t process that. Please try again.',
        annotation: demoMode ? getAnnotation(data.action) : undefined,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMsg])

      // Track demo steps
      if (demoMode && data.action) {
        setDemoSteps(prev => [...prev, { action: data.action, label: data.actionLabel || data.action }])
      }

      // Check if conversation is complete
      if (data.action === 'booking_complete' || (demoMode && turnCount + 1 >= MAX_DEMO_TURNS)) {
        setCompleted(true)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again in a moment.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, completed, demoMode, turnCount, studioSlug, sessionId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
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
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
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
            <p className="text-center text-xs text-muted-foreground">
              {demoMode ? 'Demo complete. Close this window to try again.' : 'Conversation complete.'}
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={demoMode ? 'Describe your tattoo idea...' : 'Type a message...'}
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
