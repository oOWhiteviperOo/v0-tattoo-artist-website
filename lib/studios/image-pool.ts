import { StudioConfig } from '../types/studio-config'

// Curated Unsplash tattoo photography — all verified 200 OK
// Unsplash license: free for commercial use, no attribution required
// Pool expanded 2026-02-26 to reduce collisions across 70+ sites

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595747644932-abb68f85f419?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605647533135-51b5906087d0?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561491040-14a86bca9106?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602697579058-cb09b4cc9a6e?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628802634987-56dcd0de35e6?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643984920001-dc7b2d197165?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1691048539876-b172790bb66c?w=800&h=1000&fit=crop&q=80',
  // Expanded pool
  'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557130641-1b14718f096a?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513078094721-e7b6e0394a6a?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564426622559-5af68da63b96?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610942933193-8fafd0973f6d?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583075826769-98f0923e5d56?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594091011122-3ae14fdbe243?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1638458957842-d901372fed55?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1665019771452-55140aea1b61?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512586927-3467a512fb37?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1597852075234-fd721ac361d3?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616879564267-a336232e3a95?w=800&h=1000&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561377455-190afb395ed7?w=800&h=1000&fit=crop&q=80',
]

const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513078094721-e7b6e0394a6a?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564426622559-5af68da63b96?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557130641-1b14718f096a?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561377455-190afb395ed7?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610942933193-8fafd0973f6d?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1759247943688-5d47a84dd615?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1651692883249-ed36b3523419?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1597852075234-fd721ac361d3?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605647533135-51b5906087d0?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583075826769-98f0923e5d56?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643984920001-dc7b2d197165?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1770224097206-c1e39d61b4a3?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594091011122-3ae14fdbe243?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628802634987-56dcd0de35e6?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1759806919529-7db386dd4741?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1736628283631-8d9c8167fa88?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616879564267-a336232e3a95?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595747644932-abb68f85f419?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561491040-14a86bca9106?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602697579058-cb09b4cc9a6e?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1691048539876-b172790bb66c?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1638458957842-d901372fed55?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1665019771452-55140aea1b61?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512586927-3467a512fb37?w=600&h=600&fit=crop&q=80',
  // Expanded pool
  'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542727313-4227174c44a8?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542556398-95fb5b9f9304?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1604591148554-f3cccbdf0dba?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590246815117-570af4bcf3c8?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578301978693-85fa9fd0c754?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612459284270-27236c3fba21?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590246814883-57c511e59b4f?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519084338938-8cdaf2f5e99c?w=600&h=600&fit=crop&q=80',
]

const INSTAGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513078094721-e7b6e0394a6a?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564426622559-5af68da63b96?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557130641-1b14718f096a?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561377455-190afb395ed7?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610942933193-8fafd0973f6d?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1759247943688-5d47a84dd615?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1651692883249-ed36b3523419?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1597852075234-fd721ac361d3?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583075826769-98f0923e5d56?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643984920001-dc7b2d197165?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1770224097206-c1e39d61b4a3?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594091011122-3ae14fdbe243?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1638458957842-d901372fed55?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1665019771452-55140aea1b61?w=400&h=400&fit=crop&q=80',
  // Expanded
  'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542727313-4227174c44a8?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1604591148554-f3cccbdf0dba?w=400&h=400&fit=crop&q=80',
]

const ABOUT_IMAGES = [
  'https://images.unsplash.com/photo-1595747644932-abb68f85f419?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605647533135-51b5906087d0?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643984920001-dc7b2d197165?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561491040-14a86bca9106?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628802634987-56dcd0de35e6?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602697579058-cb09b4cc9a6e?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1691048539876-b172790bb66c?w=600&h=800&fit=crop&q=80',
  // Expanded
  'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557130641-1b14718f096a?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583075826769-98f0923e5d56?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1638458957842-d901372fed55?w=600&h=800&fit=crop&q=80',
]

const OG_IMAGES = [
  'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=1200&h=630&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=1200&h=630&fit=crop&q=80',
  'https://images.unsplash.com/photo-1759247943688-5d47a84dd615?w=1200&h=630&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557130641-1b14718f096a?w=1200&h=630&fit=crop&q=80',
  'https://images.unsplash.com/photo-1763888647744-c566e723c396?w=1200&h=630&fit=crop&q=80',
  // Expanded
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=1200&h=630&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=1200&h=630&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605647533135-51b5906087d0?w=1200&h=630&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643984920001-dc7b2d197165?w=1200&h=630&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583075826769-98f0923e5d56?w=1200&h=630&fit=crop&q=80',
]

// Improved hash — uses slug length as seed via Knuth multiplicative constant
// so similar slugs (manchester-tattoo-company vs manchester-tattoo-studio) diverge
function hashSlug(slug: string): number {
  let hash = slug.length * 2654435761
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getStudioImages(slug: string) {
  const h = hashSlug(slug)
  return {
    hero: HERO_IMAGES[h % HERO_IMAGES.length],
    portfolio: Array.from({ length: 6 }, (_, i) =>
      PORTFOLIO_IMAGES[(h + i * 7 + i * i) % PORTFOLIO_IMAGES.length]
    ),
    instagram: Array.from({ length: 4 }, (_, i) =>
      INSTAGRAM_IMAGES[(h + i * 11 + 3) % INSTAGRAM_IMAGES.length]
    ),
    about: ABOUT_IMAGES[(h + 5) % ABOUT_IMAGES.length],
    og: OG_IMAGES[(h + 2) % OG_IMAGES.length],
  }
}

function isPlaceholder(url: string): boolean {
  return !url || url.includes('placehold.co') || url.includes('placeholder.svg') || url.startsWith('{{')
}

export function applyDefaultImages(config: StudioConfig): StudioConfig {
  const images = getStudioImages(config.identity.slug)

  return {
    ...config,
    hero: {
      ...config.hero,
      image: isPlaceholder(config.hero.image) ? images.hero : config.hero.image,
    },
    portfolio: {
      ...config.portfolio,
      images: config.portfolio.images.map((img, i) =>
        isPlaceholder(img) ? images.portfolio[i] || images.portfolio[0] : img
      ),
    },
    socialProof: {
      ...config.socialProof,
      instagram: {
        ...config.socialProof.instagram,
        images: config.socialProof.instagram.images.map((img, i) =>
          isPlaceholder(img) ? images.instagram[i] || images.instagram[0] : img
        ),
      },
    },
    about: {
      ...config.about,
      image: isPlaceholder(config.about.image) ? images.about : config.about.image,
    },
    seo: {
      ...config.seo,
      openGraph: {
        ...config.seo.openGraph,
        images: config.seo.openGraph.images.map((img) => ({
          ...img,
          url: isPlaceholder(img.url) ? images.og : img.url,
        })),
      },
    },
  }
}
