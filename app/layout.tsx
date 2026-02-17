import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Libre_Baskerville } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${libreBaskerville.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
