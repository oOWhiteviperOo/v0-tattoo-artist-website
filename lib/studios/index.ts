import { StudioConfig } from '../types/studio-config'
import { INK_AND_IRON } from './ink-and-iron'

const studios: Record<string, StudioConfig> = {
    'ink-and-iron': INK_AND_IRON,
}

export const DEFAULT_STUDIO = 'ink-and-iron'

export function getStudio(slug: string): StudioConfig | undefined {
    return studios[slug]
}

export function getStudioOrDefault(slug: string): StudioConfig {
    return studios[slug] || studios[DEFAULT_STUDIO]
}

export function getAllSlugs(): string[] {
    return Object.keys(studios)
}
