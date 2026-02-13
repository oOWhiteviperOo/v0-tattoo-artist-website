import { StudioConfig } from '../types/studio-config'
import { INK_AND_IRON } from './ink-and-iron'
import { TEST_STUDIO_V2 } from './test-studio-v2'
import { FATES_AND_FURY_TATTOO } from './fates-and-fury-tattoo'
import { TATTOO_SHOP_BY_DAN_GOLD } from './tattoo-shop-by-dan-gold'
// [N8N-MARKER-IMPORT]

export const studios: Record<string, StudioConfig> = {
    'ink-and-iron': INK_AND_IRON,
        'test-studio-v2': TEST_STUDIO_V2,
        'fates-and-fury-tattoo': FATES_AND_FURY_TATTOO,
        'tattoo-shop-by-dan-gold': TATTOO_SHOP_BY_DAN_GOLD,
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
