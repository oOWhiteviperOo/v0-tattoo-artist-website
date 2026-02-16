'use client'

import { motion } from 'motion/react'
import { CheckCircle2, Zap, Award, Shield } from 'lucide-react'
import { useStudio } from '@/lib/studio-context'
import { TrustMetric } from '@/lib/types/studio-config'

const ICON_MAP = {
  CheckCircle2,
  Zap,
  Award,
  Shield,
} as const

export function TrustBar() {
  const { trustMetrics } = useStudio()
  return (
    <motion.section
      className="border-y border-border bg-background py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {trustMetrics.items.map((metric: TrustMetric) => {
            const Icon = ICON_MAP[metric.iconName]
            return (
              <div key={metric.label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm text-muted-foreground">{metric.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
