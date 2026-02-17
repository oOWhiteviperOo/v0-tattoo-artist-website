'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import type { WorkflowWithStats } from '@/lib/n8n/types'

const WORKFLOW_NAMES: Record<string, string> = {
  'QgUyDWQ9dMU34ldS': 'Concierge',
  'J1jKTVofRZXYFtAI': 'Payments',
  '4udGkekeV4Vp5AzR': 'Reminders',
  'NYvCYn4TV2JagDcO': 'Demo Handler',
  'LiUiWUtrOQTK1LoI': 'Customer Enrichment',
  'kN6iaQeUzPPrNSGj': 'Site Generation',
  'PKqiDNOYg6qm3YtS': 'Batch SiteGen',
  'TzrMS2EOtvvlhfxe': 'Outreach Push',
  '5P66ceLpabsNkMp7': 'Customer Finder',
}

interface WorkflowCardProps {
  workflow: WorkflowWithStats
  onClick?: () => void
}

export function WorkflowCard({ workflow, onClick }: WorkflowCardProps) {
  const displayName = WORKFLOW_NAMES[workflow.id] || workflow.name
  const successRate = workflow.totalExecutions > 0
    ? Math.round((workflow.successCount / workflow.totalExecutions) * 100)
    : 0
  const hasRecentErrors = workflow.errorCount > 0

  return (
    <Card
      className={`transition-colors ${onClick ? 'cursor-pointer hover:border-primary/50' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{displayName}</CardTitle>
          <div className="flex items-center gap-1.5">
            {hasRecentErrors && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={workflow.active ? 'default' : 'secondary'} className="text-xs">
              {workflow.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last run</span>
            <span>
              {workflow.lastExecution
                ? formatDistanceToNow(new Date(workflow.lastExecution), { addSuffix: true })
                : 'Never'}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Executions</span>
            <span>{workflow.totalExecutions}</span>
          </div>
          {workflow.totalExecutions > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-green-600">{workflow.successCount} success</span>
                <span className={workflow.errorCount > 0 ? 'text-red-600' : 'text-muted-foreground'}>
                  {workflow.errorCount} errors
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
