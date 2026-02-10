import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function smoothScrollTo(id: string) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }
}
