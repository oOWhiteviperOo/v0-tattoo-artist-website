import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'

import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'INK & IRON — Permanent Art. Limited Slots. | Los Angeles Tattoo Studio',
  description:
    'Dark realism and blackwork tattoos by Raven Morales. Book your session at INK & IRON, Arts District, Los Angeles. Limited slots available.',
  keywords: [
    'tattoo',
    'Los Angeles',
    'dark realism',
    'blackwork',
    'tattoo studio',
    'tattoo artist',
    'Arts District LA',
  ],
  openGraph: {
    title: 'INK & IRON — Permanent Art. Limited Slots.',
    description: 'Dark realism and blackwork by Raven Morales. Book your slot.',
    type: 'website',
    locale: 'en_US',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="font-sans antialiased bg-[#0A0A0A] text-[#F5F5F5]">
        {children}
      </body>
    </html>
  )
}
