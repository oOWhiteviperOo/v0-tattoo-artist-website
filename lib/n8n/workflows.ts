import { n8nFetch } from './client'
import type { N8nWorkflow, N8nExecution, WorkflowWithStats } from './types'

interface WorkflowListResponse {
  data: N8nWorkflow[]
}

interface ExecutionListResponse {
  data: N8nExecution[]
}

export async function getAllWorkflows(): Promise<N8nWorkflow[]> {
  const response = await n8nFetch<WorkflowListResponse>('/workflows')
  return response.data || []
}

export async function getWorkflow(workflowId: string): Promise<N8nWorkflow> {
  return n8nFetch<N8nWorkflow>(`/workflows/${workflowId}`)
}

export async function getWorkflowExecutions(
  workflowId: string,
  limit = 50
): Promise<N8nExecution[]> {
  const response = await n8nFetch<ExecutionListResponse>(
    `/executions?workflowId=${workflowId}&limit=${limit}`
  )
  return response.data || []
}

export async function activateWorkflow(workflowId: string): Promise<void> {
  await n8nFetch(`/workflows/${workflowId}/activate`, { method: 'POST' })
}

export async function deactivateWorkflow(workflowId: string): Promise<void> {
  await n8nFetch(`/workflows/${workflowId}/deactivate`, { method: 'POST' })
}

export async function getWorkflowWithStats(workflowId: string): Promise<WorkflowWithStats> {
  const [workflow, executions] = await Promise.all([
    getWorkflow(workflowId),
    getWorkflowExecutions(workflowId, 100),
  ])

  return {
    ...workflow,
    totalExecutions: executions.length,
    successCount: executions.filter(e => e.status === 'success').length,
    errorCount: executions.filter(e => e.status === 'error').length,
    lastExecution: executions[0]?.startedAt || null,
  }
}
