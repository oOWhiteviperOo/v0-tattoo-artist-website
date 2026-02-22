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

        // Write to Referrals tab in Leads spreadsheet via Google Sheets API
        const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
        const LEADS_SHEET_ID = '1JUmGPXJteLv8h2rmZnNO2iCDFlWJBtM778rIR05fEVQ'

        const appendUrl = `${SHEETS_BASE}/${LEADS_SHEET_ID}/values/Referrals!A:E:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&key=${process.env.GOOGLE_SHEETS_API_KEY}`

        const row = [
            cleanSlug,
            cleanEmail,
            cleanInstagram,
            new Date().toISOString(),
            'FALSE', // convertedToStudio
        ]

        const sheetsResp = await fetch(appendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [row] }),
        })

        if (!sheetsResp.ok) {
            console.error('Sheets append failed:', await sheetsResp.text())
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
