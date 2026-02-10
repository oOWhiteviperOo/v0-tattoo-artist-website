'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollUp() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollUp}
      className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#C8A96E] bg-white/[0.03] backdrop-blur-md transition-all duration-200 hover:bg-white/[0.06] animate-in fade-in"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5 text-[#C8A96E]" />
    </button>
  )
}
