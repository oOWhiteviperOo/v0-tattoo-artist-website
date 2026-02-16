'use client'

import { useState } from 'react'
import { WorkflowCard } from '@/components/admin/workflows/WorkflowCard'
import { WorkflowControls } from '@/components/admin/workflows/WorkflowControls'
import { ExecutionHistory } from '@/components/admin/workflows/ExecutionHistory'
import { useWorkflows } from '@/lib/admin/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WorkflowWithStats } from '@/lib/n8n/types'

const WORKFLOW_NAMES: Record<string, string> = {
  'QgUyDWQ9dMU34ldS': 'Concierge',
  'J1jKTVofRZXYFtAI': 'Payments',
  '4udGkekeV4Vp5AzR': 'Reminders',
  'NYvCYn4TV2JagDcO': 'Demo Handler',
  'LiUiWUtrOQTK1LoI': 'Lead Enrichment',
  'kN6iaQeUzPPrNSGj': 'Site Generation',
  'PKqiDNOYg6qm3YtS': 'Batch SiteGen',
  'TzrMS2EOtvvlhfxe': 'Outreach Push',
  '5P66ceLpabsNkMp7': 'Lead Finder',
}

export default function WorkflowsPage() {
  const { data, isLoading, mutate } = useWorkflows()
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowWithStats | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-52 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const workflows = data?.workflows || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workflows</h1>
        <p className="text-muted-foreground text-sm">
          Monitor and control n8n automation workflows
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="space-y-2">
            <WorkflowCard
              workflow={workflow}
              onClick={() => setSelectedWorkflow(
                selectedWorkflow?.id === workflow.id ? null : workflow
              )}
            />
            <div className="px-1">
              <WorkflowControls
                workflowId={workflow.id}
                workflowName={WORKFLOW_NAMES[workflow.id] || workflow.name}
                active={workflow.active}
                onToggled={() => mutate()}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedWorkflow && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Execution History: {WORKFLOW_NAMES[selectedWorkflow.id] || selectedWorkflow.name}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setSelectedWorkflow(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ExecutionHistory workflowId={selectedWorkflow.id} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
