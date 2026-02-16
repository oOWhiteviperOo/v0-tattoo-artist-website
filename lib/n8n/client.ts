function getConfig() {
  const baseUrl = process.env.N8N_API_URL
  const apiKey = process.env.N8N_API_KEY

  if (!baseUrl) throw new Error('N8N_API_URL environment variable is not set')
  if (!apiKey) throw new Error('N8N_API_KEY environment variable is not set')

  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey }
}

export async function n8nFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const { baseUrl, apiKey } = getConfig()
  const url = `${baseUrl}/api/v1${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'X-N8N-API-KEY': apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`n8n API error ${response.status}: ${response.statusText} — ${text}`)
  }

  return response.json()
}
