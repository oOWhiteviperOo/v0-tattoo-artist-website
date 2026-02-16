'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { subDays, format, startOfDay, isAfter } from 'date-fns'
import type { BookingRow } from '@/lib/google-sheets/types'

interface RevenueChartProps {
  bookings: BookingRow[]
}

export function RevenueChart({ bookings }: RevenueChartProps) {
  const chartData = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30)
    const dailyRevenue = new Map<string, number>()

    // Initialize all 30 days with 0
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
      dailyRevenue.set(date, 0)
    }

    // Aggregate deposits by day
    for (const booking of bookings) {
      if (
        booking.depositPaidAt &&
        (booking.state === 'deposit_paid' || booking.state === 'confirmed')
      ) {
        const paidDate = startOfDay(new Date(booking.depositPaidAt))
        if (isAfter(paidDate, thirtyDaysAgo)) {
          const key = format(paidDate, 'yyyy-MM-dd')
          dailyRevenue.set(key, (dailyRevenue.get(key) || 0) + booking.depositAmount)
        }
      }
    }

    return Array.from(dailyRevenue.entries()).map(([date, revenue]) => ({
      date,
      label: format(new Date(date), 'MMM d'),
      revenue,
    }))
  }, [bookings])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Revenue (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `£${v}`}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) => [`£${value.toFixed(2)}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
