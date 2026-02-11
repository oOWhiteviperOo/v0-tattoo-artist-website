'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { smoothScrollTo } from '@/lib/utils'
import { useStudio } from '@/lib/studio-context'
import { MobileMenu } from './MobileMenu'

export function Header({ onBookingOpen }: { onBookingOpen: () => void }) {
  const { identity, nav, theme } = useStudio()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const heroHeight = window.innerHeight
      const scrollY = window.scrollY
      const progress = Math.min(scrollY / (heroHeight * 0.5), 1)
      setScrollProgress(progress)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleNavClick(href: string) {
    const id = href.replace('#', '')
    smoothScrollTo(id)
  }

  const bgOpacity = scrollProgress * 0.9
  const blurAmount = scrollProgress * 12
  const borderOpacity = scrollProgress * 0.08

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-shadow duration-300"
        style={{
          backgroundColor: `hsl(var(--background) / ${bgOpacity})`,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          borderBottom: `1px solid hsl(var(--foreground) / ${borderOpacity})`,
          boxShadow: scrollProgress > 0.5 ? `0 4px 30px rgba(0, 0, 0, ${scrollProgress * 0.3})` : 'none',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="font-sans text-lg font-bold uppercase tracking-wider text-foreground"
          >
            {identity.name}
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {nav.links.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="relative font-sans text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors duration-300 hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onBookingOpen}
              className="font-sans text-sm font-semibold uppercase tracking-wider bg-accent text-accent-foreground px-6 py-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-accent-glow"
            >
              {nav.bookButtonText}
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-foreground p-2"
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
