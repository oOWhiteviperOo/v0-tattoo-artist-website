import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { form, studio } = body

        // Basic validation
        if (!form || !studio || !process.env.N8N_BOOKING_WEBHOOK_URL) {
            console.error('Missing required fields or environment variable')
            return NextResponse.json(
                { error: 'Internal Server Error' },
                { status: 500 }
            )
        }

        // Forward to n8n
        const n8nResponse = await fetch(process.env.N8N_BOOKING_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: 'v0-tattoo-artist-website',
                studio,
                form,
                metadata: {
                    submittedAt: new Date().toISOString(),
                    userAgent: req.headers.get('user-agent') || 'unknown',
                },
            }),
        })

        if (!n8nResponse.ok) {
            console.error('n8n webhook failed', await n8nResponse.text())
            return NextResponse.json(
                { error: 'Failed to submit booking' },
                { status: 502 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Booking submission error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
