'use client'

import React, { createContext, useContext } from 'react'
import { StudioConfig } from './types/studio-config'

const StudioContext = createContext<StudioConfig | null>(null)

export function useStudio() {
    const context = useContext(StudioContext)
    if (!context) {
        throw new Error('useStudio must be used within a StudioConfigProvider')
    }
    return context
}

export function StudioConfigProvider({
    config,
    children,
}: {
    config: StudioConfig
    children: React.ReactNode
}) {
    const { theme } = config

    return (
        <StudioContext.Provider value={config}>
            <div
                style={
                    {
                        '--background': theme.background,
                        '--foreground': theme.foreground,
                        '--accent': theme.accent,
                        '--accent-foreground': theme.accentForeground,
                        '--muted-foreground': theme.mutedForeground,
                        '--dimmed-foreground': theme.dimmedForeground,
                        '--border': theme.border,
                        '--card': theme.card,
                        '--ring': theme.ring,
                        '--accent-rgb': theme.accentRgb, // Custom variable for glows
                    } as React.CSSProperties
                }
                className="min-h-screen bg-background text-foreground"
            >
                {children}
            </div>
        </StudioContext.Provider>
    )
}
