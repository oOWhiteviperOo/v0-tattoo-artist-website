import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadStudioConfig, loadAllSlugs } from '@/lib/studios/loader'
import { StudioPage } from '@/components/StudioPage'

// ISR: revalidate pages at most once per hour (on-demand revalidation via /api/revalidate)
export const revalidate = 3600

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const slugs = await loadAllSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const studio = await loadStudioConfig(slug)

    if (!studio) {
        return {}
    }

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

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const studio = await loadStudioConfig(slug)

    if (!studio) {
        notFound()
    }

    return <StudioPage config={studio} />
}
