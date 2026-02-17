import { readFile } from 'fs/promises'
import path from 'path'
import { StudioConfig } from '../types/studio-config'
import { applyDefaultImages } from './image-pool'
// Legacy fallback — remove after Phase 6 cleanup
import { studios as legacyStudios } from './index'

const STUDIOS_DIR = path.join(process.cwd(), 'data', 'studios')

export async function loadStudioConfig(slug: string): Promise<StudioConfig | null> {
    try {
        const filePath = path.join(STUDIOS_DIR, `${slug}.json`)
        const content = await readFile(filePath, 'utf-8')
        return applyDefaultImages(JSON.parse(content) as StudioConfig)
    } catch {
        // Fallback to legacy TypeScript registry
        const legacy = legacyStudios[slug]
        return legacy ? applyDefaultImages(legacy) : null
    }
}

export async function loadAllSlugs(): Promise<string[]> {
    try {
        const indexPath = path.join(STUDIOS_DIR, '_index.json')
        return JSON.parse(await readFile(indexPath, 'utf-8'))
    } catch {
        // Fallback to legacy TypeScript registry
        return Object.keys(legacyStudios)
    }
}
