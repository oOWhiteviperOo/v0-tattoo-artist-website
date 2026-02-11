import { StudioConfig } from '../types/studio-config'

export const TEMPLATE_STUDIO: StudioConfig = {
    identity: {
        name: '{{STUDIO_NAME}}',
        slug: '{{STUDIO_SLUG}}',
        tagline: '{{STUDIO_TAGLINE}}',
        artistName: '{{ARTIST_NAME}}',
    },
    theme: {
        background: '{{THEME_BACKGROUND}}', // e.g., "0 0% 4%"
        foreground: '{{THEME_FOREGROUND}}', // e.g., "0 0% 96%"
        accent: '{{THEME_ACCENT}}',       // e.g., "39 35% 61%"
        accentForeground: '{{THEME_ACCENT_FOREGROUND}}', // e.g., "0 0% 4%"
        mutedForeground: '{{THEME_MUTED_FOREGROUND}}', // e.g., "0 0% 63%"
        dimmedForeground: '{{THEME_DIMMED_FOREGROUND}}', // e.g., "0 0% 42%"
        border: '{{THEME_BORDER}}',          // e.g., "0 0% 12%"
        card: '{{THEME_CARD}}',             // e.g., "0 0% 8%"
        accentRgb: '{{THEME_ACCENT_RGB}}',   // e.g., "200, 169, 110"
        ring: '{{THEME_RING}}',             // e.g., "39 35% 61%"
    },
    seo: {
        title: '{{SEO_TITLE}}',
        description: '{{SEO_DESCRIPTION}}',
        keywords: ['{{SEO_KEYWORD_1}}', '{{SEO_KEYWORD_2}}'],
        openGraph: {
            title: '{{OG_TITLE}}',
            description: '{{OG_DESCRIPTION}}',
            type: 'website',
            locale: 'en_US',
            url: '{{SITE_URL}}',
            siteName: '{{STUDIO_NAME}}',
            images: [
                {
                    url: '{{OG_IMAGE_URL}}',
                    width: 1200,
                    height: 630,
                    alt: '{{STUDIO_NAME}}',
                },
            ],
        },
    },
    nav: {
        links: [
            { label: 'Work', href: '#work' },
            { label: 'Sessions', href: '#sessions' },
            { label: 'FAQ', href: '#faq' },
        ],
        bookButtonText: '{{NAV_BOOK_BUTTON_TEXT}}',
    },
    hero: {
        headline: ['{{HERO_HEADLINE_LINE_1}}', '{{HERO_HEADLINE_LINE_2}}'],
        subheadline: '{{HERO_SUBHEADLINE}}',
        urgencyText: '{{HERO_URGENCY_TEXT}}',
        ctaText: '{{HERO_CTA_TEXT}}',
        image: '{{HERO_IMAGE_URL}}',
        imageAlt: '{{HERO_IMAGE_ALT}}',
    },
    trustMetrics: {
        items: [
            { iconName: 'CheckCircle2', label: '{{TRUST_METRIC_1}}' },
            { iconName: 'Zap', label: '{{TRUST_METRIC_2}}' },
            { iconName: 'Award', label: '{{TRUST_METRIC_3}}' },
            { iconName: 'Shield', label: '{{TRUST_METRIC_4}}' },
        ],
    },
    portfolio: {
        sectionTitle: '{{PORTFOLIO_TITLE}}',
        subtitle: '{{PORTFOLIO_SUBTITLE}}',
        images: [
            '{{PORTFOLIO_IMAGE_1}}',
            '{{PORTFOLIO_IMAGE_2}}',
            '{{PORTFOLIO_IMAGE_3}}',
            '{{PORTFOLIO_IMAGE_4}}',
            '{{PORTFOLIO_IMAGE_5}}',
            '{{PORTFOLIO_IMAGE_6}}',
        ],
    },
    sessions: {
        sectionTitle: '{{SESSIONS_TITLE}}',
        subtitle: '{{SESSIONS_SUBTITLE}}',
        guarantee: '{{SESSIONS_GUARANTEE}}',
        popularLabel: 'Most Popular',
        waitlistButtonText: 'Join Waitlist',
        items: [
            {
                iconName: 'Zap',
                title: '{{SESSION_1_TITLE}}',
                duration: '{{SESSION_1_DURATION}}',
                price: '{{SESSION_1_PRICE}}',
                priceSubtitle: '{{SESSION_1_PRICE_SUBTITLE}}',
                features: ['{{SESSION_1_FEATURE_1}}', '{{SESSION_1_FEATURE_2}}'],
                status: 'limited',
                availabilityText: '{{SESSION_1_AVAILABILITY}}',
                buttonText: '{{SESSION_1_BUTTON_TEXT}}',
                popular: false,
                buttonVariant: 'outline',
            },
            {
                iconName: 'Clock',
                title: '{{SESSION_2_TITLE}}',
                duration: '{{SESSION_2_DURATION}}',
                price: '{{SESSION_2_PRICE}}',
                priceSubtitle: '{{SESSION_2_PRICE_SUBTITLE}}',
                features: ['{{SESSION_2_FEATURE_1}}', '{{SESSION_2_FEATURE_2}}'],
                status: 'available',
                availabilityText: '{{SESSION_2_AVAILABILITY}}',
                buttonText: '{{SESSION_2_BUTTON_TEXT}}',
                popular: true,
                buttonVariant: 'default',
            },
        ],
    },
    socialProof: {
        sectionTitle: '{{SOCIAL_PROOF_TITLE}}',
        testimonials: [
            {
                quote: '{{TESTIMONIAL_1_QUOTE}}',
                author: '{{TESTIMONIAL_1_AUTHOR}}',
                city: '{{TESTIMONIAL_1_CITY}}',
                rating: 5,
            },
            {
                quote: '{{TESTIMONIAL_2_QUOTE}}',
                author: '{{TESTIMONIAL_2_AUTHOR}}',
                city: '{{TESTIMONIAL_2_CITY}}',
                rating: 5,
            },
        ],
        trustBadges: [
            { iconName: 'CheckCircle2', label: '{{TRUST_BADGE_1}}' },
            { iconName: 'TrendingUp', label: '{{TRUST_BADGE_2}}' },
            { iconName: 'Sparkles', label: '{{TRUST_BADGE_3}}' },
            { iconName: 'Star', label: '{{TRUST_BADGE_4}}' },
        ],
        instagram: {
            label: 'Follow on Instagram {{INSTAGRAM_HANDLE}}',
            images: [
                '{{INSTAGRAM_IMAGE_1}}',
                '{{INSTAGRAM_IMAGE_2}}',
                '{{INSTAGRAM_IMAGE_3}}',
                '{{INSTAGRAM_IMAGE_4}}',
            ],
        },
    },
    about: {
        sectionTitle: '{{ABOUT_TITLE}}',
        paragraphs: [
            '{{ABOUT_PARAGRAPH_1}}',
            '{{ABOUT_PARAGRAPH_2}}',
        ],
        callout: '{{ABOUT_CALLOUT}}',
        image: '{{ABOUT_IMAGE_URL}}',
        imageAlt: '{{ABOUT_IMAGE_ALT}}',
    },
    faq: {
        sectionTitle: '{{FAQ_TITLE}}',
        items: [
            {
                id: 'faq-1',
                question: '{{FAQ_1_QUESTION}}',
                answer: '{{FAQ_1_ANSWER}}',
            },
            {
                id: 'faq-2',
                question: '{{FAQ_2_QUESTION}}',
                answer: '{{FAQ_2_ANSWER}}',
            },
        ],
    },
    finalCta: {
        headline: '{{FINAL_CTA_HEADLINE}}',
        subheadline: '{{FINAL_CTA_SUBHEADLINE}}',
        ctaText: '{{FINAL_CTA_BUTTON_TEXT}}',
    },
    booking: {
        modalTitle: '{{BOOKING_MODAL_TITLE}}',
        modalDescription: '{{BOOKING_MODAL_DESCRIPTION}}',
        successTitle: '{{BOOKING_SUCCESS_TITLE}}',
        successMessage: '{{BOOKING_SUCCESS_MESSAGE}}',
        submitText: '{{BOOKING_SUBMIT_TEXT}}',
        depositDisclaimer: '{{BOOKING_DEPOSIT_DISCLAIMER}}',
    },
    contact: {
        email: '{{CONTACT_EMAIL}}',
        instagram: '{{CONTACT_INSTAGRAM_HANDLE}}',
        instagramUrl: '{{CONTACT_INSTAGRAM_URL}}',
        phone: '{{CONTACT_PHONE}}',
        address: '{{CONTACT_ADDRESS}}',
    },
    footer: {
        copyrightHolder: '{{FOOTER_COPYRIGHT_HOLDER}}',
        tagline: '{{FOOTER_TAGLINE}}',
    },
    blurDataUrl: '{{BLUR_DATA_URL}}',
}
