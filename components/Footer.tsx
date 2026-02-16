'use client'

import { Instagram, Mail, Phone } from 'lucide-react'
import { smoothScrollTo } from '@/lib/utils'
import { useStudio } from '@/lib/studio-context'

export function Footer({ onBookingOpen }: { onBookingOpen: () => void }) {
  const { identity, contact, nav, footer } = useStudio()
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div>
            <p className="font-display text-xl font-normal text-foreground hover:text-accent transition-colors duration-200">
              {identity.name}
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {footer.tagline}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{contact.address}</p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Quick Links
            </p>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {nav.links.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                  className="text-left text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={onBookingOpen}
                className="text-left text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {nav.bookButtonText}
              </button>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                {contact.phone}
              </a>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
                {contact.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {footer.copyrightHolder}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Terms & Conditions
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
