'use client'

import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { smoothScrollTo } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onBookingOpen: () => void
}

export function MobileMenu({ isOpen, onClose, onBookingOpen }: MobileMenuProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  function handleNavClick(href: string) {
    onClose()
    setTimeout(() => {
      const id = href.replace('#', '')
      smoothScrollTo(id)
    }, 200)
  }

  function handleBooking() {
    onClose()
    setTimeout(() => {
      onBookingOpen()
    }, 200)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#0A0A0A]/95 backdrop-blur-md animate-in fade-in duration-200"
      role="navigation"
      aria-label="Mobile menu"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 text-[#F5F5F5] p-2"
        aria-label="Close menu"
      >
        <X className="h-6 w-6" />
      </button>

      {NAV_LINKS.map((link) => (
        <button
          key={link.href}
          type="button"
          onClick={() => handleNavClick(link.href)}
          className="font-sans text-3xl font-semibold uppercase tracking-wider text-[#F5F5F5] transition-colors duration-300 hover:text-[#C8A96E]"
        >
          {link.label}
        </button>
      ))}

      <button
        type="button"
        onClick={handleBooking}
        className="mt-4 w-64 bg-[#C8A96E] text-[#0A0A0A] px-8 py-4 font-sans text-lg font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(200,169,110,0.25)]"
      >
        Book a Slot
      </button>
    </div>
  )
}
