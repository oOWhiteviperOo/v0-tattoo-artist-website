'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { smoothScrollTo } from '@/lib/utils'
import { MobileMenu } from './MobileMenu'

export function Header({ onBookingOpen }: { onBookingOpen: () => void }) {
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
          backgroundColor: `rgba(10, 10, 10, ${bgOpacity})`,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
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
            className="font-sans text-lg font-bold uppercase tracking-wider text-[#F5F5F5]"
          >
            INK & IRON
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="relative font-sans text-sm font-medium uppercase tracking-widest text-[#A1A1A1] transition-colors duration-300 hover:text-[#F5F5F5] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C8A96E] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onBookingOpen}
              className="font-sans text-sm font-semibold uppercase tracking-wider bg-[#C8A96E] text-[#0A0A0A] px-6 py-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(200,169,110,0.25)]"
            >
              Book a Slot
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-[#F5F5F5] p-2"
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
