'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Testimonial } from '@/lib/types/studio-config'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={`star-${i}`}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-accent/70 text-accent/70' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full flex-col justify-between border border-border bg-card p-6 rounded transition-colors duration-300 hover:border-accent/20">
      <div>
        <StarRating rating={testimonial.rating} />
        <div className="mt-4">
          <span className="block font-display text-3xl text-accent/30 leading-none select-none">&ldquo;</span>
          <p className="mt-1 text-base leading-relaxed text-foreground">
            {testimonial.quote}
          </p>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
        <p className="text-xs text-muted-foreground">{testimonial.city}</p>
      </div>
    </div>
  )
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const maxIndex = isMobile ? testimonials.length - 1 : Math.max(0, testimonials.length - 3)

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, maxIndex))
      setCurrentIndex(clamped)
      if (scrollRef.current && isMobile) {
        const child = scrollRef.current.children[clamped] as HTMLElement
        if (child) {
          child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        }
      }
    },
    [maxIndex, isMobile],
  )

  // Desktop grid view
  if (!isMobile) {
    return (
      <div>
        <div className="flex items-center justify-end mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground rounded transition-all duration-200 hover:border-foreground/20 hover:text-foreground active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(currentIndex + 1)}
              disabled={currentIndex >= maxIndex}
              className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground rounded transition-all duration-200 hover:border-foreground/20 hover:text-foreground active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {testimonials.slice(currentIndex, currentIndex + 3).map((t) => (
            <TestimonialCard key={t.author} testimonial={t} />
          ))}
        </div>
      </div>
    )
  }

  // Mobile swipe carousel
  return (
    <div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((t) => (
          <div key={t.author} className="w-[85vw] flex-shrink-0 snap-start sm:w-[70vw]">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="mt-6 flex justify-center gap-3">
        {testimonials.map((t, i) => (
          <button
            key={t.author}
            type="button"
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-accent scale-110' : 'bg-border hover:bg-muted-foreground/30'}`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
