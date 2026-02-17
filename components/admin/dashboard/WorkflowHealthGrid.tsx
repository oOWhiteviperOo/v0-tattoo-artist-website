import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { N8nWorkflow } from '@/lib/n8n/types'

interface WorkflowHealthGridProps {
  workflows: N8nWorkflow[]
}

// Friendly display names for known workflows
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

export function WorkflowHealthGrid({ workflows }: WorkflowHealthGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Workflow Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span className="text-sm font-medium truncate">
                {WORKFLOW_NAMES[workflow.id] || workflow.name}
              </span>
              <Badge variant={workflow.active ? 'default' : 'secondary'}>
                {workflow.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
