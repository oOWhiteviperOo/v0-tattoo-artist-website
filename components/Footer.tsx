'use client'

import { Instagram, Mail, Phone } from 'lucide-react'
import { NAV_LINKS, CONTACT } from '@/lib/constants'
import { smoothScrollTo } from '@/lib/utils'

export function Footer({ onBookingOpen }: { onBookingOpen: () => void }) {
  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div>
            <p className="font-sans text-lg font-bold uppercase tracking-wider text-[#F5F5F5]">
              INK & IRON
            </p>
            <p className="mt-2 text-sm text-[#A1A1A1]">
              Permanent Art. Limited Slots.
            </p>
            <p className="mt-1 text-sm text-[#6B6B6B]">{CONTACT.address}</p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#6B6B6B]">
              Quick Links
            </p>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                  className="text-left text-sm text-[#A1A1A1] transition-colors duration-300 hover:text-[#C8A96E]"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={onBookingOpen}
                className="text-left text-sm text-[#A1A1A1] transition-colors duration-300 hover:text-[#C8A96E]"
              >
                Book a Slot
              </button>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#6B6B6B]">
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 text-sm text-[#A1A1A1] transition-colors duration-300 hover:text-[#C8A96E]"
              >
                <Mail className="h-4 w-4" />
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-2 text-sm text-[#A1A1A1] transition-colors duration-300 hover:text-[#C8A96E]"
              >
                <Phone className="h-4 w-4" />
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#A1A1A1] transition-colors duration-300 hover:text-[#C8A96E]"
              >
                <Instagram className="h-4 w-4" />
                {CONTACT.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-[#6B6B6B]">
            &copy; {new Date().getFullYear()} INK & IRON. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-[#6B6B6B] transition-colors hover:text-[#A1A1A1]">
              Terms & Conditions
            </a>
            <a href="#" className="text-xs text-[#6B6B6B] transition-colors hover:text-[#A1A1A1]">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
