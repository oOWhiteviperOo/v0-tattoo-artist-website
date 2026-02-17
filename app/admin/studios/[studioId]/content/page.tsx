'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { ArrowLeft, Save, ExternalLink, Plus, Trash2 } from 'lucide-react'
import type { StudioConfig } from '@/lib/types/studio-config'

function Field({ label, value, onChange, multiline, placeholder }: {
    label: string
    value: string
    onChange: (v: string) => void
    multiline?: boolean
    placeholder?: string
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            {multiline ? (
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="text-sm"
                />
            ) : (
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="text-sm"
                />
            )}
        </div>
    )
}

function ListField({ label, items, onChange, placeholder }: {
    label: string
    items: string[]
    onChange: (items: string[]) => void
    placeholder?: string
}) {
    return (
        <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                    <Input
                        value={item}
                        onChange={(e) => {
                            const next = [...items]
                            next[i] = e.target.value
                            onChange(next)
                        }}
                        placeholder={placeholder}
                        className="text-sm"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange(items.filter((_, j) => j !== i))}
                        className="shrink-0"
                    >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                </div>
            ))}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onChange([...items, ''])}
                className="text-xs"
            >
                <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
        </div>
    )
}

export default function ContentEditorPage() {
    const params = useParams<{ studioId: string }>()
    const router = useRouter()
    const [config, setConfig] = useState<StudioConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

    // studioId here is the slug
    const slug = params.studioId

    useEffect(() => {
        fetch(`/api/admin/studio-content/${slug}`)
            .then(r => {
                if (!r.ok) throw new Error('Not found')
                return r.json()
            })
            .then(setConfig)
            .catch(() => setConfig(null))
            .finally(() => setLoading(false))
    }, [slug])

    const save = async () => {
        if (!config) return
        setSaving(true)
        setSaveStatus('idle')
        try {
            const res = await fetch(`/api/admin/studio-content/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            })
            if (!res.ok) throw new Error('Save failed')
            setSaveStatus('success')
            setTimeout(() => setSaveStatus('idle'), 3000)
        } catch {
            setSaveStatus('error')
        } finally {
            setSaving(false)
        }
    }

    // Helper to update nested config fields
    const update = <K extends keyof StudioConfig>(
        section: K,
        field: string,
        value: unknown
    ) => {
        if (!config) return
        setConfig({
            ...config,
            [section]: { ...(config[section] as Record<string, unknown>), [field]: value },
        })
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-[400px]" />
            </div>
        )
    }

    if (!config) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <p className="text-muted-foreground">Studio config not found for slug: {slug}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/studios/${slug}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Edit Landing Page</h1>
                    <p className="text-sm text-muted-foreground">{config.identity.name}</p>
                </div>
                <a
                    href={`/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    Preview <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <Button onClick={save} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save & Publish'}
                </Button>
            </div>

            {saveStatus === 'success' && (
                <div className="text-sm text-green-600 bg-green-500/10 border border-green-200/20 px-4 py-2 rounded">
                    Saved and published. Page will update within 60 seconds.
                </div>
            )}
            {saveStatus === 'error' && (
                <div className="text-sm text-red-600 bg-red-500/10 border border-red-200/20 px-4 py-2 rounded">
                    Failed to save. Check the console for details.
                </div>
            )}

            <Accordion type="multiple" defaultValue={['identity', 'hero']} className="space-y-3">
                {/* Identity & Theme */}
                <AccordionItem value="identity">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">Identity & Theme</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Studio Name" value={config.identity.name} onChange={(v) => update('identity', 'name', v)} />
                                    <Field label="Slug" value={config.identity.slug} onChange={(v) => update('identity', 'slug', v)} />
                                    <Field label="Tagline" value={config.identity.tagline || ''} onChange={(v) => update('identity', 'tagline', v)} placeholder="e.g., Dark Realism & Blackwork" />
                                    <Field label="Artist Name" value={config.identity.artistName || ''} onChange={(v) => update('identity', 'artistName', v)} />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Accent Color (HSL)" value={config.theme.accent} onChange={(v) => update('theme', 'accent', v)} placeholder="39 35% 61%" />
                                    <Field label="Accent RGB" value={config.theme.accentRgb} onChange={(v) => update('theme', 'accentRgb', v)} placeholder="200, 169, 110" />
                                    <Field label="Background (HSL)" value={config.theme.background} onChange={(v) => update('theme', 'background', v)} />
                                    <Field label="Card (HSL)" value={config.theme.card} onChange={(v) => update('theme', 'card', v)} />
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                {/* Hero */}
                <AccordionItem value="hero">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">Hero Section</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
                                <ListField label="Headline Lines" items={config.hero.headline} onChange={(v) => update('hero', 'headline', v)} placeholder="e.g., ARTISTRY IN PERMANENCE" />
                                <Field label="Subheadline" value={config.hero.subheadline} onChange={(v) => update('hero', 'subheadline', v)} multiline />
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Urgency Text" value={config.hero.urgencyText} onChange={(v) => update('hero', 'urgencyText', v)} placeholder="Accepting New Clients for March" />
                                    <Field label="CTA Button Text" value={config.hero.ctaText} onChange={(v) => update('hero', 'ctaText', v)} />
                                </div>
                                <Field label="Hero Image URL" value={config.hero.image} onChange={(v) => update('hero', 'image', v)} placeholder="https://images.unsplash.com/..." />
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                {/* Portfolio */}
                <AccordionItem value="portfolio">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">Portfolio</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
                                <Field label="Section Title" value={config.portfolio.sectionTitle} onChange={(v) => update('portfolio', 'sectionTitle', v)} />
                                <Field label="Subtitle" value={config.portfolio.subtitle} onChange={(v) => update('portfolio', 'subtitle', v)} multiline />
                                <ListField label="Image URLs" items={config.portfolio.images} onChange={(v) => update('portfolio', 'images', v)} placeholder="https://images.unsplash.com/..." />
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                {/* Sessions */}
                <AccordionItem value="sessions">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">Sessions / Pricing</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-6 pt-0">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Section Title" value={config.sessions.sectionTitle} onChange={(v) => update('sessions', 'sectionTitle', v)} />
                                    <Field label="Guarantee Text" value={config.sessions.guarantee} onChange={(v) => update('sessions', 'guarantee', v)} />
                                </div>
                                <Field label="Subtitle" value={config.sessions.subtitle} onChange={(v) => update('sessions', 'subtitle', v)} multiline />
                                {config.sessions.items.map((session, idx) => (
                                    <Card key={idx} className="border-dashed">
                                        <CardContent className="pt-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">Session {idx + 1}</p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const next = config.sessions.items.filter((_, i) => i !== idx)
                                                        setConfig({ ...config, sessions: { ...config.sessions, items: next } })
                                                    }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <Field label="Title" value={session.title} onChange={(v) => {
                                                    const next = [...config.sessions.items]
                                                    next[idx] = { ...next[idx], title: v }
                                                    setConfig({ ...config, sessions: { ...config.sessions, items: next } })
                                                }} />
                                                <Field label="Duration" value={session.duration} onChange={(v) => {
                                                    const next = [...config.sessions.items]
                                                    next[idx] = { ...next[idx], duration: v }
                                                    setConfig({ ...config, sessions: { ...config.sessions, items: next } })
                                                }} />
                                                <Field label="Price" value={session.price} onChange={(v) => {
                                                    const next = [...config.sessions.items]
                                                    next[idx] = { ...next[idx], price: v }
                                                    setConfig({ ...config, sessions: { ...config.sessions, items: next } })
                                                }} />
                                                <Field label="Availability" value={session.availabilityText} onChange={(v) => {
                                                    const next = [...config.sessions.items]
                                                    next[idx] = { ...next[idx], availabilityText: v }
                                                    setConfig({ ...config, sessions: { ...config.sessions, items: next } })
                                                }} />
                                            </div>
                                            <Field label="Price Subtitle" value={session.priceSubtitle} onChange={(v) => {
                                                const next = [...config.sessions.items]
                                                next[idx] = { ...next[idx], priceSubtitle: v }
                                                setConfig({ ...config, sessions: { ...config.sessions, items: next } })
                                            }} />
                                            <ListField label="Features" items={session.features} onChange={(v) => {
                                                const next = [...config.sessions.items]
                                                next[idx] = { ...next[idx], features: v }
                                                setConfig({ ...config, sessions: { ...config.sessions, items: next } })
                                            }} />
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newSession = {
                                            iconName: 'Zap' as const,
                                            title: '',
                                            duration: '',
                                            price: '',
                                            priceSubtitle: '',
                                            features: [],
                                            status: 'available' as const,
                                            availabilityText: 'Available',
                                            buttonText: 'Book Now',
                                            popular: false,
                                            buttonVariant: 'outline' as const,
                                        }
                                        setConfig({ ...config, sessions: { ...config.sessions, items: [...config.sessions.items, newSession] } })
                                    }}
                                >
                                    <Plus className="h-3 w-3 mr-1" /> Add Session
                                </Button>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                {/* Testimonials */}
                <AccordionItem value="social-proof">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">Social Proof</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
                                <Field label="Section Title" value={config.socialProof.sectionTitle} onChange={(v) => {
                                    setConfig({ ...config, socialProof: { ...config.socialProof, sectionTitle: v } })
                                }} />
                                {config.socialProof.testimonials.map((t, idx) => (
                                    <Card key={idx} className="border-dashed">
                                        <CardContent className="pt-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">Testimonial {idx + 1}</p>
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    const next = config.socialProof.testimonials.filter((_, i) => i !== idx)
                                                    setConfig({ ...config, socialProof: { ...config.socialProof, testimonials: next } })
                                                }}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                            <Field label="Quote" value={t.quote} onChange={(v) => {
                                                const next = [...config.socialProof.testimonials]
                                                next[idx] = { ...next[idx], quote: v }
                                                setConfig({ ...config, socialProof: { ...config.socialProof, testimonials: next } })
                                            }} multiline />
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <Field label="Author" value={t.author} onChange={(v) => {
                                                    const next = [...config.socialProof.testimonials]
                                                    next[idx] = { ...next[idx], author: v }
                                                    setConfig({ ...config, socialProof: { ...config.socialProof, testimonials: next } })
                                                }} />
                                                <Field label="City" value={t.city} onChange={(v) => {
                                                    const next = [...config.socialProof.testimonials]
                                                    next[idx] = { ...next[idx], city: v }
                                                    setConfig({ ...config, socialProof: { ...config.socialProof, testimonials: next } })
                                                }} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => {
                                    setConfig({
                                        ...config,
                                        socialProof: {
                                            ...config.socialProof,
                                            testimonials: [...config.socialProof.testimonials, { quote: '', author: '', city: '', rating: 5 }],
                                        },
                                    })
                                }}>
                                    <Plus className="h-3 w-3 mr-1" /> Add Testimonial
                                </Button>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                {/* About */}
                <AccordionItem value="about">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">About</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
                                <Field label="Section Title" value={config.about.sectionTitle} onChange={(v) => update('about', 'sectionTitle', v)} />
                                <ListField label="Paragraphs" items={config.about.paragraphs} onChange={(v) => update('about', 'paragraphs', v)} placeholder="About the artist..." />
                                <Field label="Callout Quote" value={config.about.callout} onChange={(v) => update('about', 'callout', v)} multiline />
                                <Field label="Image URL" value={config.about.image} onChange={(v) => update('about', 'image', v)} />
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                {/* FAQ */}
                <AccordionItem value="faq">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">FAQ</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
                                <Field label="Section Title" value={config.faq.sectionTitle} onChange={(v) => update('faq', 'sectionTitle', v)} />
                                {config.faq.items.map((item, idx) => (
                                    <Card key={idx} className="border-dashed">
                                        <CardContent className="pt-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">FAQ {idx + 1}</p>
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    const next = config.faq.items.filter((_, i) => i !== idx)
                                                    setConfig({ ...config, faq: { ...config.faq, items: next } })
                                                }}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                            <Field label="Question" value={item.question} onChange={(v) => {
                                                const next = [...config.faq.items]
                                                next[idx] = { ...next[idx], question: v }
                                                setConfig({ ...config, faq: { ...config.faq, items: next } })
                                            }} />
                                            <Field label="Answer" value={item.answer} onChange={(v) => {
                                                const next = [...config.faq.items]
                                                next[idx] = { ...next[idx], answer: v }
                                                setConfig({ ...config, faq: { ...config.faq, items: next } })
                                            }} multiline />
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => {
                                    const id = `faq-${config.faq.items.length + 1}`
                                    setConfig({
                                        ...config,
                                        faq: { ...config.faq, items: [...config.faq.items, { id, question: '', answer: '' }] },
                                    })
                                }}>
                                    <Plus className="h-3 w-3 mr-1" /> Add FAQ
                                </Button>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                {/* Booking */}
                <AccordionItem value="booking">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">Booking Modal</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Modal Title" value={config.booking.modalTitle} onChange={(v) => update('booking', 'modalTitle', v)} />
                                    <Field label="Submit Button Text" value={config.booking.submitText} onChange={(v) => update('booking', 'submitText', v)} />
                                </div>
                                <Field label="Modal Description" value={config.booking.modalDescription} onChange={(v) => update('booking', 'modalDescription', v)} multiline />
                                <Field label="Success Title" value={config.booking.successTitle} onChange={(v) => update('booking', 'successTitle', v)} />
                                <Field label="Success Message" value={config.booking.successMessage} onChange={(v) => update('booking', 'successMessage', v)} multiline />
                                <Field label="Deposit Disclaimer" value={config.booking.depositDisclaimer} onChange={(v) => update('booking', 'depositDisclaimer', v)} multiline />
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>

                {/* Contact & Footer */}
                <AccordionItem value="contact">
                    <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <CardTitle className="text-base">Contact & Footer</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Email" value={config.contact.email} onChange={(v) => update('contact', 'email', v)} />
                                    <Field label="Phone" value={config.contact.phone} onChange={(v) => update('contact', 'phone', v)} />
                                    <Field label="Instagram Handle" value={config.contact.instagram} onChange={(v) => update('contact', 'instagram', v)} />
                                    <Field label="Instagram URL" value={config.contact.instagramUrl} onChange={(v) => update('contact', 'instagramUrl', v)} />
                                </div>
                                <Field label="Address" value={config.contact.address} onChange={(v) => update('contact', 'address', v)} />
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Copyright Holder" value={config.footer.copyrightHolder} onChange={(v) => update('footer', 'copyrightHolder', v)} />
                                    <Field label="Footer Tagline" value={config.footer.tagline} onChange={(v) => update('footer', 'tagline', v)} />
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            </Accordion>

            {/* Sticky save bar */}
            <div className="sticky bottom-0 py-4 bg-background/80 backdrop-blur-md border-t border-border/30 flex items-center justify-end gap-4">
                <a
                    href={`/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    Preview <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
                <Button onClick={save} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save & Publish'}
                </Button>
            </div>
        </div>
    )
}
