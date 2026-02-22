import { NextResponse } from 'next/server'

// Cache metrics for 1 hour
let cachedMetrics: { data: MetricsData; fetchedAt: number } | null = null
const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hour

interface MetricsData {
  activeStudios: number
  totalBookings: number
  sitesBuilt: number
  avgResponseTimeSec: number | null
}

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
const BOOKINGS_SHEET_ID = '12F1Wfe5SjdSNUhqoZE1I4ySg21S1aE2sS6hLIp7yzao'

// Static metrics for early stage (< 3 active studios)
const EARLY_STAGE_METRICS: MetricsData = {
  activeStudios: 0,
  totalBookings: 0,
  sitesBuilt: 71,
  avgResponseTimeSec: null,
}

export async function GET() {
  try {
    // Return cached if fresh
    if (cachedMetrics && Date.now() - cachedMetrics.fetchedAt < CACHE_DURATION_MS) {
      return NextResponse.json(cachedMetrics.data, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
      })
    }

    // Fetch Studios sheet to count active studios
    // Note: This uses the Google Sheets API key approach (public read) or service account
    // For now, return early-stage metrics since we don't have a server-side Google auth token
    // This will be enhanced when we have > 3 active studios
    const metrics: MetricsData = { ...EARLY_STAGE_METRICS }

    cachedMetrics = { data: metrics, fetchedAt: Date.now() }

    return NextResponse.json(metrics, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
    })
  } catch (error) {
    console.error('Metrics API error:', error)

    // Return stale cache or defaults on error
    if (cachedMetrics) {
      return NextResponse.json(cachedMetrics.data)
    }

    return NextResponse.json(EARLY_STAGE_METRICS)
  }
}
