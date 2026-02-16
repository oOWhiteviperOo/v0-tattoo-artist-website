import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { activateWorkflow, deactivateWorkflow, getWorkflow } from '@/lib/n8n/workflows'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { workflowId } = await params
    const body = await request.json()
    const { active } = body

    if (active) {
      await activateWorkflow(workflowId)
    } else {
      await deactivateWorkflow(workflowId)
    }

    const workflow = await getWorkflow(workflowId)
    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('Failed to toggle workflow:', error)
    return NextResponse.json(
      { error: 'Failed to toggle workflow' },
      { status: 500 }
    )
  }
}
