/**
 * Google Sheets data proxy via n8n webhook.
 * Instead of calling Google Sheets API directly (which requires service account keys),
 * we route through an n8n workflow that uses its existing OAuth credentials.
 */

function getConfig() {
  const baseUrl = process.env.N8N_API_URL
  if (!baseUrl) throw new Error('N8N_API_URL environment variable is not set')
  return { baseUrl: baseUrl.replace(/\/$/, '') }
}

export async function sheetsProxy<T = unknown>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const { baseUrl } = getConfig()
  const url = `${baseUrl}/webhook/admin/sheets-proxy?action=${encodeURIComponent(action)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Sheets proxy error ${response.status}: ${text}`)
  }

  return response.json()
}
