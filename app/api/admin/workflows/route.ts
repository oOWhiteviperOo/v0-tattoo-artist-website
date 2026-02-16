import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { getAllWorkflows, getWorkflowExecutions } from '@/lib/n8n/workflows'
import type { WorkflowWithStats } from '@/lib/n8n/types'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const workflows = await getAllWorkflows()

    const workflowsWithStats: WorkflowWithStats[] = await Promise.all(
      workflows.map(async (workflow) => {
        try {
          const executions = await getWorkflowExecutions(workflow.id, 100)
          return {
            ...workflow,
            totalExecutions: executions.length,
            successCount: executions.filter(e => e.status === 'success').length,
            errorCount: executions.filter(e => e.status === 'error').length,
            lastExecution: executions[0]?.startedAt || null,
          }
        } catch {
          return {
            ...workflow,
            totalExecutions: 0,
            successCount: 0,
            errorCount: 0,
            lastExecution: null,
          }
        }
      })
    )

    return NextResponse.json({ workflows: workflowsWithStats })
  } catch (error) {
    console.error('Failed to fetch workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}
