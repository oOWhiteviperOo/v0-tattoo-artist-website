import { NextResponse } from 'next/server'

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://n8n.apexaisystems.co.uk'

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      message,
      studioSlug,
      sessionId,
      turnCount,
      conversationHistory,
      extractedEntities,
      completed,
    } = body

    // Validate required fields
    if (!message || !studioSlug || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, studioSlug, sessionId' },
        { status: 400 }
      )
    }

    // Sanitise and validate message
    const sanitised = stripHtml(String(message)).slice(0, 2000)
    if (!sanitised) {
      return NextResponse.json(
        { error: 'Message is empty after sanitisation' },
        { status: 400 }
      )
    }

    // Validate conversationHistory if provided
    if (conversationHistory && !Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'conversationHistory must be an array' },
        { status: 400 }
      )
    }

    // Determine webhook path based on demo mode
    const url = new URL(req.url)
    const isDemo = url.searchParams.get('demo') === 'true'
    const webhookPath = isDemo ? 'apex-chat-demo' : 'apex-chat'
    const webhookUrl = `${N8N_BASE_URL}/webhook/${webhookPath}`

    if (isDemo) {
      console.log('Demo session:', sessionId, studioSlug, `turn:${turnCount}`)
    }

    // Build the payload for the Concierge chat webhook
    const payload = {
      data: {
        client: {
          name: isDemo ? 'Demo User' : 'Chat User',
          email: isDemo ? 'demo@example.com' : '',
          phone: '',
          studioSlug,
        },
        message: sanitised,
        channel: isDemo ? 'demo-chat' : 'chat',
        studioSlug,
        sessionId,
        turnCount: turnCount || 1,
        conversationHistory: Array.isArray(conversationHistory)
          ? conversationHistory.slice(-10)
          : [],
        extractedEntities: extractedEntities || {},
        completed: completed || false,
      },
    }

    // Forward to n8n webhook with 10s timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    let n8nResponse: Response
    try {
      n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
    } catch (fetchErr: unknown) {
      clearTimeout(timeout)
      const isAbort = fetchErr instanceof Error && fetchErr.name === 'AbortError'
      console.error('n8n fetch failed:', isAbort ? 'timeout' : fetchErr)
      return NextResponse.json(
        { error: 'Chat service unavailable' },
        { status: 502 }
      )
    }
    clearTimeout(timeout)

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
      intent: data.intent || undefined,
      action: data.action || undefined,
      availableSlots: data.availableSlots || undefined,
      depositUrl: data.depositUrl || undefined,
      bookingId: data.bookingId || undefined,
      escalated: data.escalated || false,
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
