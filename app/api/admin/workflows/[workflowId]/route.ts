import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { getWorkflow, getWorkflowExecutions } from '@/lib/n8n/workflows'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { workflowId } = await params
    const [workflow, executions] = await Promise.all([
      getWorkflow(workflowId),
      getWorkflowExecutions(workflowId, 50),
    ])

    return NextResponse.json({ workflow, executions })
  } catch (error) {
    console.error('Failed to fetch workflow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    )
  }
}
