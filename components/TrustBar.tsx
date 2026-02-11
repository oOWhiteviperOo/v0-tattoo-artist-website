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
      className="border-y border-border bg-background py-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
        {trustMetrics.items.map((metric: TrustMetric) => {
          const Icon = ICON_MAP[metric.iconName]
          return (
            <div key={metric.label} className="flex flex-col items-center gap-3 text-center">
              <Icon className="h-5 w-5 text-accent" />
              <span className="font-sans text-sm text-muted-foreground">{metric.label}</span>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}
