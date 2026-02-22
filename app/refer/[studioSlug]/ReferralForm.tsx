'use client'

import { useState } from 'react'

interface Props {
    studioSlug: string
}

export function ReferralForm({ studioSlug }: Props) {
    const [email, setEmail] = useState('')
    const [instagram, setInstagram] = useState('')
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrorMsg('')

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(email)) {
            setErrorMsg('Please enter a valid email address')
            return
        }

        setStatus('submitting')
        try {
            const resp = await fetch('/api/referral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referringStudioSlug: studioSlug,
                    visitorEmail: email.trim().toLowerCase(),
                    visitorInstagram: instagram.trim().replace(/^@/, ''),
                }),
            })

            if (!resp.ok) {
                const data = await resp.json()
                throw new Error(data.error || 'Failed to submit')
            }

            setStatus('success')
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="px-6 py-8 text-center">
                <div className="w-12 h-12 mx-auto bg-[#dcfce7] rounded-full flex items-center justify-center">
                    <span className="text-[#22c55e] text-xl">&#10003;</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#111827]">
                    Thanks for your interest!
                </h3>
                <p className="mt-2 text-sm text-[#6b7280]">
                    We&apos;ll be in touch about setting up your studio with Apex Influence.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#374151]"
                >
                    Your email <span className="text-[#ef4444]">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="studio@example.com"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                />
            </div>
            <div>
                <label
                    htmlFor="instagram"
                    className="block text-sm font-medium text-[#374151]"
                >
                    Instagram handle{' '}
                    <span className="text-[#9ca3af] font-normal">(optional)</span>
                </label>
                <input
                    id="instagram"
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@yourstudio"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                />
            </div>

            {errorMsg && (
                <p className="text-sm text-[#ef4444]">{errorMsg}</p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-lg bg-[#111827] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === 'submitting' ? 'Submitting...' : 'Get started'}
            </button>
        </form>
    )
}
