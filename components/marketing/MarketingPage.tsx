'use client'

import { MarketingNav } from './MarketingNav'
import { MarketingHero } from './MarketingHero'
import { SocialProofBar } from './SocialProofBar'
import { ProblemSection } from './ProblemSection'
import { ProofQuote } from './ProofQuote'
import { HowItWorks } from './HowItWorks'
import { DemoShowcase } from './DemoShowcase'
import { PricingSection } from './PricingSection'
import { FAQSection } from './FAQSection'
import { ProcessTimeline } from './ProcessTimeline'
import { ContactCTA } from './ContactCTA'
import { MarketingFooter } from './MarketingFooter'

export function MarketingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <MarketingHero />
      <SocialProofBar />
      <ProblemSection />
      <ProofQuote />
      <HowItWorks />
      <DemoShowcase />
      <PricingSection />
      <FAQSection />
      <ProcessTimeline />
      <ContactCTA />
      <MarketingFooter />
    </div>
  )
}
