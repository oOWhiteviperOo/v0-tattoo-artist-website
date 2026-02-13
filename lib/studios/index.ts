import { StudioConfig } from '../types/studio-config'
import { INK_AND_IRON } from './ink-and-iron'
import { TEST_STUDIO_V2 } from './test-studio-v2'
import { FATES_AND_FURY_TATTOO } from './fates-and-fury-tattoo'
import { TATTOO_SHOP_BY_DAN_GOLD } from './tattoo-shop-by-dan-gold'
import { WEST_ONE_TATTOO } from './west-one-tattoo'
import { MIDNIGHT_TATTOO_AND_PIERCE } from './midnight-tattoo-and-pierce'
import { NERO_PRENTA_TATTOO } from './nero-prenta-tattoo'
import { GUNG_HO_TATTOO } from './gung-ho-tattoo'
// [N8N-MARKER-IMPORT]

export const studios: Record<string, StudioConfig> = {
    'ink-and-iron': INK_AND_IRON,
        'test-studio-v2': TEST_STUDIO_V2,
        'fates-and-fury-tattoo': FATES_AND_FURY_TATTOO,
        'tattoo-shop-by-dan-gold': TATTOO_SHOP_BY_DAN_GOLD,
        'west-one-tattoo': WEST_ONE_TATTOO,
        'midnight-tattoo-and-pierce': MIDNIGHT_TATTOO_AND_PIERCE,
        'nero-prenta-tattoo': NERO_PRENTA_TATTOO,
        'gung-ho-tattoo': GUNG_HO_TATTOO,
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
