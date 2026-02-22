import { NextResponse } from 'next/server'

// Simple in-memory rate limiter (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(ip)

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
        return false
    }

    if (entry.count >= RATE_LIMIT) return true

    entry.count++
    return false
}

function sanitize(str: string): string {
    return str
        .replace(/<[^>]*>/g, '') // Strip HTML
        .replace(/[&<>"']/g, '') // Strip special chars
        .trim()
        .slice(0, 200) // Max length
}

export async function POST(req: Request) {
    try {
        // Rate limiting by IP
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            'unknown'

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many submissions. Please try again later.' },
                { status: 429 }
            )
        }

        const body = await req.json()
        const { referringStudioSlug, visitorEmail, visitorInstagram } = body

        // Validate required fields
        if (!referringStudioSlug || !visitorEmail) {
            return NextResponse.json(
                { error: 'Email and studio reference are required.' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const cleanEmail = sanitize(visitorEmail).toLowerCase()
        if (!emailPattern.test(cleanEmail)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address.' },
                { status: 400 }
            )
        }

        const cleanSlug = sanitize(referringStudioSlug)
        const cleanInstagram = sanitize(visitorInstagram || '')

        // Write to Referrals tab via n8n webhook (same pattern as booking API)
        const N8N_BASE = process.env.N8N_BASE_URL || 'https://n8n.apexink.uk'
        const webhookUrl = `${N8N_BASE}/webhook/apex-referral`

        const sheetsResp = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                referringStudioSlug: cleanSlug,
                visitorEmail: cleanEmail,
                visitorInstagram: cleanInstagram,
                timestamp: new Date().toISOString(),
            }),
        })

        if (!sheetsResp.ok) {
            console.error('Referral webhook failed:', await sheetsResp.text())
            return NextResponse.json(
                { error: 'Failed to save your details. Please try again.' },
                { status: 502 }
            )
        }

        console.log(
            JSON.stringify({
                logType: 'referral_submitted',
                referringStudio: cleanSlug,
                timestamp: new Date().toISOString(),
            })
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Referral submission error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
