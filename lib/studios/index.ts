import { StudioConfig } from '../types/studio-config'
import { INK_AND_IRON } from './ink-and-iron'
import { TEST_STUDIO_V2 } from './test-studio-v2'
// [N8N-MARKER-IMPORT]

export const studios: Record<string, StudioConfig> = {
    'ink-and-iron': INK_AND_IRON,
        'test-studio-v2': TEST_STUDIO_V2,
    // [N8N-MARKER-REGISTRY]
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
