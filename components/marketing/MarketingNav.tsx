'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { smoothScrollTo } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const NAV_LINKS = [
  { label: 'The Problem', id: 'problem' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Live Demos', id: 'demos' },
  { label: 'Pricing', id: 'pricing' },
]

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 64)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={{
        boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-4 h-[8vh] min-h-[56px] max-h-[72px]">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center gap-1.5"
        >
          <span className="text-accent font-bold text-xl tracking-tight">Apex</span>
          <span className="text-foreground/60 text-xl tracking-tight">Ink</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => smoothScrollTo(link.id)}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground hover:underline hover:underline-offset-4 hover:decoration-foreground/30"
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => smoothScrollTo('contact')}
            className="bg-accent text-accent-foreground px-5 py-2 text-sm font-medium rounded-[8px] transition-all duration-200 hover:bg-accent-hover hover:shadow-glow active:translate-y-[1px] active:bg-accent-pressed"
          >
            Book a Demo
          </button>
        </nav>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="md:hidden text-foreground p-2 transition-colors hover:bg-secondary"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
                <div className="flex items-center gap-1.5">
                  <span className="text-accent font-bold text-lg">Apex</span>
                  <span className="text-foreground/60 text-lg">Ink</span>
                </div>
              </div>
              <nav className="flex flex-col gap-1 px-3 py-4">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setTimeout(() => smoothScrollTo(link.id), 300)
                    }}
                    className="text-left px-3 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              <div className="mt-auto px-6 pb-8">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    setTimeout(() => smoothScrollTo('contact'), 300)
                  }}
                  className="w-full bg-accent text-accent-foreground py-3 text-sm font-medium rounded-[8px] transition-all hover:bg-accent-hover hover:shadow-glow"
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
