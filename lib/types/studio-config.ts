export interface SessionData {
    iconName: 'Zap' | 'Clock' | 'Calendar'
    title: string
    duration: string
    price: string
    priceSubtitle: string
    features: string[]
    status: 'available' | 'limited' | 'sold_out'
    availabilityText: string
    buttonText: string
    popular?: boolean
    buttonVariant: 'default' | 'outline'
}

export interface Testimonial {
    quote: string
    author: string
    city: string
    rating: number
}

export interface FAQItem {
    id: string
    question: string
    answer: string
}

export interface TreatmentType {
    name: string
    slug: string
    durationMins: number
    priceRange: string        // e.g., "£200–£400"
    depositAmount: number     // in pence, e.g., 5000 = £50
    consultRequired: boolean
    category: string          // e.g., "injectables", "skin", "body"
}

export interface TrustMetric {
    iconName: 'CheckCircle2' | 'Zap' | 'Award' | 'Shield' | 'Clock' | 'MessageSquare'
    label: string
}

export interface TrustBadge {
    iconName: 'CheckCircle2' | 'TrendingUp' | 'Sparkles' | 'Star'
    label: string
}

export interface StudioConfig {
    vertical?: 'tattoo' | 'aesthetics'  // defaults to 'tattoo'
    identity: {
        name: string
        slug: string
        tagline?: string
        artistName?: string
        customDomain?: string   // e.g., "ironinktattoo.co.uk"
        subdomain?: string      // e.g., "ironink" (for ironink.apexaisystems.co.uk)
    }
    theme: {
        background: string // HSL values, e.g., "0 0% 4%"
        foreground: string
        accent: string
        accentForeground: string
        mutedForeground: string
        dimmedForeground: string
        border: string
        card: string
        accentRgb: string // "r, g, b" for glows
        ring: string // usually same as accent
    }
    seo: {
        title: string
        description: string
        keywords: string[]
        openGraph: {
            title: string
            description: string
            type: 'website'
            locale: string
            url: string
            siteName: string
            images: Array<{
                url: string
                width: number
                height: number
                alt: string
            }>
        }
    }
    nav: {
        links: Array<{ label: string; href: string }>
        bookButtonText: string
    }
    hero: {
        headline: string[]
        subheadline: string
        urgencyText: string
        ctaText: string
        image: string
        imageAlt: string
    }
    trustMetrics: {
        items: TrustMetric[]
    }
    siteMetrics?: TrustMetric[] // Real outcome metrics from API (e.g. "150 Bookings Handled")
    portfolio: {
        sectionTitle: string
        subtitle: string
        images: string[]
    }
    sessions: {
        sectionTitle: string
        subtitle: string
        items: SessionData[]
        guarantee: string
        popularLabel: string
        waitlistButtonText: string // if needed, though SessionData has buttonText
    }
    socialProof: {
        sectionTitle: string
        testimonials: Testimonial[]
        trustBadges: TrustBadge[]
        instagram: {
            label: string
            images: string[]
        }
    }
    about: {
        sectionTitle: string
        paragraphs: string[]
        callout: string
        image: string
        imageAlt: string
    }
    faq: {
        sectionTitle: string
        items: FAQItem[]
    }
    finalCta: {
        headline: string
        subheadline: string
        ctaText: string
    }
    treatments?: {
        menu: TreatmentType[]
        medicalFlagInstructions?: string
        pretreatmentInstructions?: string
        aftercareInstructions?: string
    }
    booking: {
        modalTitle: string
        modalDescription: string
        successTitle: string
        successMessage: string
        submitText: string
        depositDisclaimer: string
    }
    contact: {
        email: string
        instagram: string
        instagramUrl: string
        phone: string
        address: string
    }
    footer: {
        copyrightHolder: string
        tagline: string
    }
    blurDataUrl: string
}
