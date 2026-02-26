'use client'

import { motion } from 'motion/react'
import { CheckCircle2, Zap, Award, Shield, Clock, MessageSquare } from 'lucide-react'
import { useStudio } from '@/lib/studio-context'
import { TrustMetric } from '@/lib/types/studio-config'

const ICON_MAP = {
  CheckCircle2,
  Zap,
  Award,
  Shield,
  Clock,
  MessageSquare,
} as const

const OUTCOME_DEFAULTS: TrustMetric[] = [
  { iconName: 'CheckCircle2', label: 'Custom Designs Only' },
  { iconName: 'Shield', label: 'Licensed & Insured' },
  { iconName: 'Award', label: 'Sterile Environment' },
  { iconName: 'Zap', label: 'Free Consultations' },
]

export function TrustBar() {
  const config = useStudio()
  const { trustMetrics } = config
  const siteMetrics = (config as unknown as Record<string, unknown>).siteMetrics as TrustMetric[] | undefined

  // If siteMetrics are defined (real data), show those. Otherwise use config trustMetrics or outcome defaults.
  const metrics = siteMetrics && siteMetrics.length > 0
    ? siteMetrics
    : trustMetrics.items.length > 0
      ? trustMetrics.items
      : OUTCOME_DEFAULTS

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
          {metrics.map((metric: TrustMetric) => {
            const Icon = ICON_MAP[metric.iconName as keyof typeof ICON_MAP] || CheckCircle2
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
