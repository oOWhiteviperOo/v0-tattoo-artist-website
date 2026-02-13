import { StudioConfig } from '../types/studio-config'
import { INK_AND_IRON } from './ink-and-iron'
import { TEST_STUDIO_V2 } from './test-studio-v2'
import { FATES_AND_FURY_TATTOO } from './fates-and-fury-tattoo'
import { TATTOO_SHOP_BY_DAN_GOLD } from './tattoo-shop-by-dan-gold'
import { WEST_ONE_TATTOO } from './west-one-tattoo'
import { MIDNIGHT_TATTOO_AND_PIERCE } from './midnight-tattoo-and-pierce'
import { NERO_PRENTA_TATTOO } from './nero-prenta-tattoo'
import { GUNG_HO_TATTOO } from './gung-ho-tattoo'
import { ALICENEEDSTATTOOS } from './aliceneedstattoos'
import { SIXTYINK_LONDON_TATTOO_STUDIO } from './sixtyink-london-tattoo-studio'
import { THE_CIRCLE_LONDON } from './the-circle-london'
import { TATTOO_13 } from './tattoo-13'
import { ONE_BY_ONE_TATTOO } from './one-by-one-tattoo'
import { RED_POINT_TATTOO_TATTOO_STUDIO_NORTH_LONDON } from './red-point-tattoo-tattoo-studio-north-london'
import { ORIGIN_TATTOO_LONDON } from './origin-tattoo-london'
import { ONE_DAY_TATTOO_STUDIO_LONDON } from './one-day-tattoo-studio-london'
import { FRITH_STREET_TATTOO } from './frith-street-tattoo'
import { GYPSY_STABLES_TATTOO_COLLECTIVE } from './gypsy-stables-tattoo-collective'
import { THE_LONDON_SOCIAL_TATTOO_SOHO } from './the-london-social-tattoo-soho'
import { SAI_SAI_INK } from './sai-sai-ink'
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
        'aliceneedstattoos': ALICENEEDSTATTOOS,
        'sixtyink-london-tattoo-studio': SIXTYINK_LONDON_TATTOO_STUDIO,
        'the-circle-london': THE_CIRCLE_LONDON,
        'tattoo-13': TATTOO_13,
        'one-by-one-tattoo': ONE_BY_ONE_TATTOO,
        'red-point-tattoo-tattoo-studio-north-london': RED_POINT_TATTOO_TATTOO_STUDIO_NORTH_LONDON,
        'origin-tattoo-london': ORIGIN_TATTOO_LONDON,
        'one-day-tattoo-studio-london': ONE_DAY_TATTOO_STUDIO_LONDON,
        'frith-street-tattoo': FRITH_STREET_TATTOO,
        'gypsy-stables-tattoo-collective': GYPSY_STABLES_TATTOO_COLLECTIVE,
        'the-london-social-tattoo-soho': THE_LONDON_SOCIAL_TATTOO_SOHO,
        'sai-sai-ink': SAI_SAI_INK,
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
