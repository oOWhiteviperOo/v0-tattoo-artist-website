'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { smoothScrollTo } from '@/lib/utils'
import { useStudio } from '@/lib/studio-context'
import { MobileMenu } from './MobileMenu'

export function Header({ onBookingOpen }: { onBookingOpen: () => void }) {
  const { identity, nav } = useStudio()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 64)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleNavClick(href: string) {
    const id = href.replace('#', '')
    smoothScrollTo(id)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border'
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{
          boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none',
          transition: 'background-color 0.5s, border-color 0.5s, box-shadow 0.5s',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="font-display text-xl font-normal text-foreground transition-colors duration-200 hover:text-accent"
          >
            {identity.name}
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {nav.links.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="font-sans text-sm font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onBookingOpen}
              className="font-sans text-sm font-medium bg-accent text-accent-foreground px-5 py-2 rounded transition-all duration-200 hover:bg-accent/90 active:scale-[0.98]"
            >
              {nav.bookButtonText}
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-foreground p-2 rounded transition-colors duration-200 hover:bg-secondary"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onBookingOpen={onBookingOpen}
      />
    </>
  )
}
