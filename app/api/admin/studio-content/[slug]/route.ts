import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'

const STUDIOS_DIR = path.join(process.cwd(), 'data', 'studios')

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params

    try {
        const filePath = path.join(STUDIOS_DIR, `${slug}.json`)
        const content = await readFile(filePath, 'utf-8')
        return NextResponse.json(JSON.parse(content))
    } catch {
        return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params

    try {
        const config = await request.json()

        // Validate slug matches config identity
        if (config.identity?.slug && config.identity.slug !== slug) {
            return NextResponse.json({ error: 'Slug mismatch' }, { status: 400 })
        }

        const filePath = path.join(STUDIOS_DIR, `${slug}.json`)
        await writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8')

        // Trigger ISR revalidation for this studio's page
        revalidatePath(`/${slug}`)

        return NextResponse.json({ success: true, slug })
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to save', details: String(err) },
            { status: 500 }
        )
    }
}
