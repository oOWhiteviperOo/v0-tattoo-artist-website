'use client'

import { Fragment } from 'react'
import { useStudio } from '@/lib/studio-context'
import { TrustMetric } from '@/lib/types/studio-config'

export function TrustBar() {
  const { trustMetrics } = useStudio()
  return (
    <section className="border-y border-border bg-background py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustMetrics.items.map((metric: TrustMetric, i: number) => (
            <Fragment key={metric.label}>
              {i > 0 && <span className="hidden sm:block h-4 w-px bg-border" />}
              <span className="text-sm text-muted-foreground">{metric.label}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
