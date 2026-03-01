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

function SectionDivider() {
  return <hr className="border-t border-hairline mx-auto max-w-content" />
}

export function MarketingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <MarketingHero />
      <SocialProofBar />
      <ProblemSection />
      <ProofQuote />
      <SectionDivider />
      <HowItWorks />
      <DemoShowcase />
      <PricingSection />
      <FAQSection />
      <ProcessTimeline />
      <SectionDivider />
      <ContactCTA />
      <MarketingFooter />
    </div>
  )
}
