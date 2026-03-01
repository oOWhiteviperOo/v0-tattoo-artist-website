import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { form, studio, vertical } = body

        // Basic validation
        if (!form || !studio || !process.env.N8N_BOOKING_WEBHOOK_URL) {
            console.error('Missing required fields or environment variable')
            return NextResponse.json(
                { error: 'Internal Server Error' },
                { status: 500 }
            )
        }

        const isAesthetics = vertical === 'aesthetics'

        // Forward to n8n
        const n8nResponse = await fetch(process.env.N8N_BOOKING_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: isAesthetics ? 'apex-ai-booking-page' : 'v0-tattoo-artist-website',
                vertical: vertical || 'tattoo',
                studio,
                form: {
                    ...form,
                    // Map aesthetics-specific fields
                    ...(isAesthetics && form.sessionType ? { treatmentType: form.sessionType } : {}),
                    ...(isAesthetics && form.treatmentArea ? { treatmentArea: form.treatmentArea } : {}),
                    ...(isAesthetics && form.previousTreatments ? { previousTreatments: form.previousTreatments } : {}),
                },
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
