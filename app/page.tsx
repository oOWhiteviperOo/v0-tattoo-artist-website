import { getStudioOrDefault, DEFAULT_STUDIO } from '@/lib/studios'
import { StudioPage } from '@/components/StudioPage'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const studio = getStudioOrDefault(DEFAULT_STUDIO)
  const { seo } = studio

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      type: 'website',
      locale: seo.openGraph.locale,
      url: seo.openGraph.url,
      siteName: seo.openGraph.siteName,
      images: seo.openGraph.images,
    },
  }
}

export default function Home() {
  const studio = getStudioOrDefault(DEFAULT_STUDIO)

  return <StudioPage config={studio} />
}
