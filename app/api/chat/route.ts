import { NextResponse } from 'next/server'

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://n8n.apexink.uk'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, studioSlug, sessionId, turnCount, completed } = body

    // Basic validation
    if (!message || !studioSlug) {
      return NextResponse.json(
        { error: 'Missing required fields: message and studioSlug' },
        { status: 400 }
      )
    }

    // Message length guard
    if (typeof message !== 'string' || message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long (max 500 characters)' },
        { status: 400 }
      )
    }

    // Determine webhook path based on demo mode
    const url = new URL(req.url)
    const isDemo = url.searchParams.get('demo') === 'true'
    const webhookPath = isDemo ? 'apex-chat-demo' : 'apex-chat'
    const webhookUrl = `${N8N_BASE_URL}/webhook/${webhookPath}`

    // Log demo sessions (no PII)
    if (isDemo) {
      console.log('Demo session:', sessionId, studioSlug, `turn:${turnCount}`)
    }

    // Build the payload in the format Concierge expects
    const payload = {
      data: {
        client: {
          name: isDemo ? 'Demo User' : 'Chat User',
          email: isDemo ? 'demo@example.com' : '',
          phone: '',
          studioSlug,
        },
        message,
        channel: isDemo ? 'demo-chat' : 'chat',
        studioSlug,
        sessionId: sessionId || undefined,
        turnCount: turnCount || 1,
        completed: completed || false,
      },
    }

    // Forward to n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error(`n8n webhook failed (${n8nResponse.status}):`, errorText)
      return NextResponse.json(
        { error: 'Chat service unavailable' },
        { status: 502 }
      )
    }

    // Parse n8n response
    const data = await n8nResponse.json()

    // Return structured response to BookingAgent component
    return NextResponse.json({
      response: data.response || data.message || data.aiResponse || '',
      action: data.action || data.intent || undefined,
      actionLabel: data.actionLabel || undefined,
      isDemoMode: isDemo,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
