'use client'

import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { smoothScrollTo } from '@/lib/utils'
import { useStudio } from '@/lib/studio-context'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onBookingOpen: () => void
}

export function MobileMenu({ isOpen, onClose, onBookingOpen }: MobileMenuProps) {
  const { nav } = useStudio()
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background/95 backdrop-blur-md animate-in fade-in duration-200"
      role="navigation"
      aria-label="Mobile menu"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 text-foreground p-2"
        aria-label="Close menu"
      >
        <X className="h-6 w-6" />
      </button>

      {nav.links.map((link) => (
        <button
          key={link.href}
          type="button"
          onClick={() => handleNavClick(link.href)}
          className="font-display text-3xl font-normal text-foreground transition-colors duration-200 hover:text-accent"
        >
          {link.label}
        </button>
      ))}

      <button
        type="button"
        onClick={handleBooking}
        className="mt-4 w-64 bg-accent text-accent-foreground px-8 py-3.5 font-sans text-base font-medium rounded-sm transition-colors duration-200 hover:bg-accent/90"
      >
        {nav.bookButtonText}
      </button>
    </div>
  )
}
