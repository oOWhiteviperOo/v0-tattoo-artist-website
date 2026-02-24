import { notFound } from 'next/navigation'
import { loadStudioConfig } from '@/lib/studios/loader'
import { ManageContent } from './ManageContent'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}

export default async function ManagePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { ref } = await searchParams
  const config = await loadStudioConfig(slug)

  if (!config) {
    notFound()
  }

  return <ManageContent config={config} bookingRef={ref} />
}
