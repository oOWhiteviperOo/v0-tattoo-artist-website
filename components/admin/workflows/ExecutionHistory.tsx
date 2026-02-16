'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { format, differenceInSeconds } from 'date-fns'
import type { N8nExecution } from '@/lib/n8n/types'

const STATUS_STYLES = {
  success: 'bg-green-50 text-green-700 border-green-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  waiting: 'bg-amber-50 text-amber-700 border-amber-200',
} as const

interface ExecutionHistoryProps {
  workflowId: string
}

export function ExecutionHistory({ workflowId }: ExecutionHistoryProps) {
  const [executions, setExecutions] = useState<N8nExecution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/workflows/${workflowId}`)
      .then(r => r.json())
      .then(data => setExecutions(data.executions || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [workflowId])

  if (loading) {
    return <p className="text-sm text-muted-foreground py-4">Loading executions...</p>
  }

  if (executions.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No executions found</p>
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {executions.slice(0, 25).map((exec) => {
        const duration = exec.stoppedAt && exec.startedAt
          ? differenceInSeconds(new Date(exec.stoppedAt), new Date(exec.startedAt))
          : null

        return (
          <div
            key={exec.id}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`text-xs ${STATUS_STYLES[exec.status] || ''}`}
              >
                {exec.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {exec.startedAt ? format(new Date(exec.startedAt), 'dd MMM HH:mm:ss') : '—'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {duration !== null && <span>{duration}s</span>}
              <span>{exec.mode}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
