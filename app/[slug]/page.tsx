import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStudio, getAllSlugs } from '@/lib/studios'
import { StudioPage } from '@/components/StudioPage'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const slugs = getAllSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const studio = getStudio(slug)

    if (!studio) {
        return {}
    }

    const { seo, theme } = studio

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
        // We can't set theme color here easily for dynamic routes in the strict sense without viewport export,
        // but Next.js 14 handles viewport separate. For now we stick to standard metadata.
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const studio = getStudio(slug)

    if (!studio) {
        notFound()
    }

    return <StudioPage config={studio} />
}
