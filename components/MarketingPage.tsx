'use client'

import { ArrowRight, Clock, MessageSquare, CreditCard, Bell, BarChart3, Shield, Zap, CheckCircle2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const DEMO_STUDIOS = [
    { slug: 'holier-than-thou', name: 'Holier Than Thou', city: 'Manchester' },
    { slug: 'frith-street-tattoo', name: 'Frith Street Tattoo', city: 'London' },
    { slug: 'rain-city-tattoo-collective', name: 'Rain City Tattoo', city: 'Manchester' },
    { slug: 'the-family-business-tattoo', name: 'The Family Business', city: 'London' },
    { slug: 'good-fortune-studio', name: 'Good Fortune Studio', city: 'London' },
]

const PROBLEMS = [
    {
        icon: MessageSquare,
        title: 'DMs pile up, leads go cold',
        description: 'Every hour a booking request sits unanswered, you lose 20-40% chance of converting it.',
    },
    {
        icon: Clock,
        title: '30-60 minutes of admin per booking',
        description: 'Back-and-forth messages, calendar checking, chasing deposits. Time you should spend tattooing.',
    },
    {
        icon: CreditCard,
        title: '15-30% revenue lost to no-shows',
        description: 'No deposit, no commitment. Clients ghost, slots go empty, income disappears.',
    },
]

const STEPS = [
    {
        step: '01',
        title: 'We build your booking page',
        description: 'A custom website for your studio with your branding, portfolio, pricing, and a working booking form. Live in 24 hours.',
    },
    {
        step: '02',
        title: 'AI handles every inquiry',
        description: 'Booking requests are triaged instantly. Calendar checked, deposit link sent, client confirmed. Under 60 seconds.',
    },
    {
        step: '03',
        title: 'You just tattoo',
        description: 'Reminders go out automatically. No-shows drop. Your calendar fills. We handle the admin so you handle the needle.',
    },
]

const FEATURES = [
    { icon: Zap, label: 'Instant AI responses' },
    { icon: CreditCard, label: 'Automated deposits via Stripe' },
    { icon: Bell, label: 'SMS + email reminders' },
    { icon: BarChart3, label: 'Calendar management' },
    { icon: Shield, label: 'GDPR compliant' },
    { icon: CheckCircle2, label: 'Zero setup for you' },
]

const TIERS = [
    {
        name: 'Starter',
        price: '199',
        description: 'Everything you need to stop losing bookings',
        features: [
            'AI booking concierge',
            'Custom studio website',
            'Stripe deposit collection',
            'SMS + email reminders (48h, 24h, 2h)',
            'Google Calendar sync',
            'Slack alerts for your team',
            'Monthly check-in call',
        ],
        cta: 'Start Free Trial',
        popular: false,
    },
    {
        name: 'Pro',
        price: '299',
        description: 'For studios ready to grow revenue',
        features: [
            'Everything in Starter',
            'Multi-artist routing',
            'Review generation campaigns',
            'Post-appointment follow-ups',
            'Instagram DM auto-responses',
            'Monthly analytics report',
            'Priority same-day support',
        ],
        cta: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Studio Ops',
        price: '499',
        description: 'Full operations automation',
        features: [
            'Everything in Pro',
            'Live analytics dashboard',
            'Client reactivation sequences',
            'Waitlist auto-fill on cancellations',
            'KPI reporting',
            'Custom integrations',
            'Quarterly strategy calls',
        ],
        cta: 'Contact Us',
        popular: false,
    },
]

export function MarketingPage() {
    return (
        <div className="min-h-screen">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-accent font-bold text-xl tracking-tight">Apex</span>
                        <span className="text-foreground/60 text-xl tracking-tight">Ink</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
                        <a href="#problem" className="hover:text-foreground transition-colors">The Problem</a>
                        <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
                        <a href="#demos" className="hover:text-foreground transition-colors">Live Demos</a>
                        <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                    </div>
                    <a
                        href="#pricing"
                        className="bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Get Started
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-accent/30 text-accent text-xs font-medium tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                        Now onboarding UK studios
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6 text-foreground">
                        Stop losing bookings
                        <br />
                        <span className="text-accent">to slow replies</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        AI-powered booking automation for UK tattoo studios.
                        We handle the DMs, deposits, and reminders.
                        You handle the needle.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#pricing"
                            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 text-base font-medium hover:opacity-90 transition-opacity"
                        >
                            Start Free Trial
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#demos"
                            className="inline-flex items-center gap-2 border border-border text-foreground/80 px-8 py-3.5 text-base font-medium hover:border-foreground/30 transition-colors"
                        >
                            See Live Demos
                        </a>
                    </div>

                    {/* Trust metrics */}
                    <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-muted-foreground">
                        {FEATURES.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-accent/70" />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem */}
            <section id="problem" className="py-20 px-6 border-t border-border/30">
                <div className="max-w-5xl mx-auto">
                    <p className="text-accent text-xs font-medium tracking-wider uppercase mb-3">The problem</p>
                    <h2 className="font-display text-3xl md:text-4xl mb-4 text-foreground">
                        Your inbox is costing you money
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mb-12">
                        UK tattoo studios lose thousands every month to slow responses, missed bookings, and no-shows. Sound familiar?
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {PROBLEMS.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="p-6 border border-border/50 bg-card/50">
                                <Icon className="w-5 h-5 text-accent mb-4" />
                                <h3 className="text-foreground font-medium mb-2">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-20 px-6 border-t border-border/30">
                <div className="max-w-5xl mx-auto">
                    <p className="text-accent text-xs font-medium tracking-wider uppercase mb-3">How it works</p>
                    <h2 className="font-display text-3xl md:text-4xl mb-12 text-foreground">
                        Three steps. Zero effort from you.
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {STEPS.map(({ step, title, description }) => (
                            <div key={step}>
                                <span className="text-accent/40 font-display text-5xl">{step}</span>
                                <h3 className="text-foreground font-medium text-lg mt-2 mb-3">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live demos */}
            <section id="demos" className="py-20 px-6 border-t border-border/30">
                <div className="max-w-5xl mx-auto">
                    <p className="text-accent text-xs font-medium tracking-wider uppercase mb-3">Live demos</p>
                    <h2 className="font-display text-3xl md:text-4xl mb-4 text-foreground">
                        See it working for real studios
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mb-12">
                        Every demo below is a fully working booking page built for a real UK studio. Personalised branding, live booking forms, instant responses.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {DEMO_STUDIOS.map(({ slug, name, city }) => (
                            <Link
                                key={slug}
                                href={`/${slug}`}
                                className="group flex items-center justify-between p-5 border border-border/50 bg-card/30 hover:border-accent/30 hover:bg-card/60 transition-all"
                            >
                                <div>
                                    <p className="text-foreground font-medium group-hover:text-accent transition-colors">{name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{city}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            </Link>
                        ))}
                    </div>

                    <p className="text-sm text-muted-foreground mt-6">
                        71 studios and counting. <span className="text-accent">Yours could be next.</span>
                    </p>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 px-6 border-t border-border/30">
                <div className="max-w-5xl mx-auto">
                    <p className="text-accent text-xs font-medium tracking-wider uppercase mb-3">Pricing</p>
                    <h2 className="font-display text-3xl md:text-4xl mb-4 text-foreground">
                        Less than your monthly ink spend
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mb-12">
                        No contracts. No setup fees for early adopters. 14-day free trial on every plan.
                        If we don&apos;t book you 5+ extra appointments in 30 days, you don&apos;t pay.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TIERS.map(({ name, price, description, features, cta, popular }) => (
                            <div
                                key={name}
                                className={`relative p-6 border bg-card/30 flex flex-col ${
                                    popular ? 'border-accent/50' : 'border-border/50'
                                }`}
                            >
                                {popular && (
                                    <span className="absolute -top-3 left-6 px-3 py-0.5 bg-accent text-accent-foreground text-xs font-medium">
                                        Most Popular
                                    </span>
                                )}
                                <h3 className="text-foreground font-medium text-lg">{name}</h3>
                                <div className="mt-3 mb-1">
                                    <span className="text-3xl font-display text-foreground">&pound;{price}</span>
                                    <span className="text-muted-foreground text-sm">/month</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">{description}</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-accent/70 mt-0.5 shrink-0" />
                                            <span className="text-foreground/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="mailto:hello@apexink.uk"
                                    className={`block text-center py-3 text-sm font-medium transition-opacity hover:opacity-90 ${
                                        popular
                                            ? 'bg-accent text-accent-foreground'
                                            : 'border border-border text-foreground/80 hover:border-foreground/30'
                                    }`}
                                >
                                    {cta}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6 border-t border-border/30">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-display text-3xl md:text-4xl mb-4 text-foreground">
                        Ready to fill your calendar?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        We&apos;ll build you a personalised demo site for free. No commitment, no setup, no catch.
                        Just reply and we&apos;ll show you what your studio&apos;s page could look like.
                    </p>
                    <a
                        href="mailto:hello@apexink.uk"
                        className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 text-base font-medium hover:opacity-90 transition-opacity"
                    >
                        Get Your Free Demo
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-border/30">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="text-accent font-bold">Apex</span>
                        <span className="text-foreground/40">Ink</span>
                        <span className="ml-2">&copy; {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="mailto:hello@apexink.uk" className="hover:text-foreground transition-colors">hello@apexink.uk</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
