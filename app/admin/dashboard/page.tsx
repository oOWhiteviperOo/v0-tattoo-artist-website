import { Suspense } from 'react'
import { MetricCard } from '@/components/admin/dashboard/MetricCard'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { ActivityFeed } from '@/components/admin/dashboard/ActivityFeed'
import { WorkflowHealthGrid } from '@/components/admin/dashboard/WorkflowHealthGrid'
import { getAllStudios } from '@/lib/google-sheets/studios'
import { getAllBookings } from '@/lib/google-sheets/bookings'
import { getAllWorkflows } from '@/lib/n8n/workflows'
import { isToday } from 'date-fns'
import { Building2, CalendarDays, PoundSterling, Workflow } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default async function DashboardPage() {
  const [studios, bookings, workflows] = await Promise.all([
    getAllStudios().catch(() => []),
    getAllBookings().catch(() => []),
    getAllWorkflows().catch(() => []),
  ])

  const activeStudios = studios.filter(s => s.active).length
  const todayBookings = bookings.filter(b => {
    try {
      return b.createdAt && isToday(new Date(b.createdAt))
    } catch {
      return false
    }
  }).length

  const totalRevenue = bookings
    .filter(b => b.state === 'deposit_paid' || b.state === 'confirmed')
    .reduce((sum, b) => sum + b.depositAmount, 0)

  const activeWorkflows = workflows.filter(w => w.active).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your Apex Influence platform
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Studios"
          value={activeStudios}
          description={`${studios.length} total studios`}
          icon={Building2}
        />
        <MetricCard
          title="Today's Bookings"
          value={todayBookings}
          description="New bookings today"
          icon={CalendarDays}
        />
        <MetricCard
          title="Total Revenue"
          value={`£${totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`}
          description="Deposits collected"
          icon={PoundSterling}
        />
        <MetricCard
          title="Active Workflows"
          value={activeWorkflows}
          description={`${workflows.length} total workflows`}
          icon={Workflow}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[320px]" />}>
          <RevenueChart bookings={bookings} />
        </Suspense>
        <ActivityFeed bookings={bookings} />
      </div>

      <WorkflowHealthGrid workflows={workflows} />
    </div>
  )
}
