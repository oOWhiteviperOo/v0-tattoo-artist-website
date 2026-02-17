import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const { slug, secret } = await request.json()

    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    if (!slug || typeof slug !== 'string') {
        return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }

    revalidatePath(`/${slug}`)
    return NextResponse.json({ revalidated: true, slug })
}
