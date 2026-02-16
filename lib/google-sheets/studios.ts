import { sheetsProxy } from './client'
import type { StudioRow } from './types'

interface ProxyResponse {
  data: StudioRow[]
}

export async function getAllStudios(): Promise<StudioRow[]> {
  const response = await sheetsProxy<ProxyResponse>('studios')
  return response.data || []
}

export async function getStudioById(studioId: string): Promise<StudioRow | null> {
  const allStudios = await getAllStudios()
  return allStudios.find(s => s.studioId === studioId) || null
}

export async function updateStudio(studioId: string, updates: Partial<StudioRow>): Promise<void> {
  const response = await sheetsProxy<{ success?: boolean; error?: string }>('studios_update', {
    studioId,
    updates,
  })

  if (response.error) {
    throw new Error(response.error)
  }
}
