import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <h2 className="mb-4 text-3xl font-bold tracking-tighter text-accent">Studio Not Found</h2>
            <p className="mb-8 text-muted-foreground">The studio you are looking for does not exist.</p>
            <Link
                href="/"
                className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return Home
            </Link>
        </div>
    )
}
