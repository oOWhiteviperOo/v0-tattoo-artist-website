'use client'

import { motion } from 'motion/react'
import { CheckCircle2, Zap, Award, Shield } from 'lucide-react'
import { TRUST_METRICS } from '@/lib/constants'

const ICON_MAP = {
  CheckCircle2,
  Zap,
  Award,
  Shield,
} as const

export function TrustBar() {
  return (
    <motion.section
      className="border-y border-white/5 bg-[#0A0A0A] py-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
        {TRUST_METRICS.map((metric) => {
          const Icon = ICON_MAP[metric.iconName]
          return (
            <div key={metric.label} className="flex flex-col items-center gap-3 text-center">
              <Icon className="h-5 w-5 text-[#C8A96E]" />
              <span className="font-sans text-sm text-[#A1A1A1]">{metric.label}</span>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}
