/**
 * Shared motion constants for marketing components.
 * All marketing animations use these values for consistency.
 * Duration: 220ms (within 180-260ms spec range)
 * Ease: custom cubic-bezier [0.22, 1, 0.36, 1]
 * Stagger: 80ms between items
 */

export const EASE = [0.22, 1, 0.36, 1] as const

export const REVEAL = {
  initial: { y: 8 },
  animate: { y: 0 },
  transition: { duration: 0.22, ease: EASE },
} as const

export const STAGGER_DELAY = 0.08

export const REVEAL_DELAY = (i: number) => ({
  ...REVEAL,
  transition: { ...REVEAL.transition, delay: i * STAGGER_DELAY },
})
