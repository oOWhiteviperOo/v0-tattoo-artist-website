export interface N8nWorkflow {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
  tags?: Array<{ id: string; name: string }>
}

export interface N8nExecution {
  id: string
  finished: boolean
  mode: string
  startedAt: string
  stoppedAt: string
  workflowId: string
  status: 'success' | 'error' | 'waiting'
}

export interface WorkflowWithStats extends N8nWorkflow {
  totalExecutions: number
  successCount: number
  errorCount: number
  lastExecution: string | null
}
