import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, studioName, message } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn('N8N_CONTACT_WEBHOOK_URL not set — logging contact form submission')
      console.log('Contact form submission:', { name, email, studioName, message })
      return NextResponse.json({ success: true })
    }

    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'apexink-landing-page',
        name,
        email,
        studioName: studioName || '',
        message: message || '',
        submittedAt: new Date().toISOString(),
      }),
    })

    if (!n8nResponse.ok) {
      console.error('n8n contact webhook failed:', await n8nResponse.text())
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
