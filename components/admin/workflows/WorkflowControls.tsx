'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface WorkflowControlsProps {
  workflowId: string
  workflowName: string
  active: boolean
  onToggled?: () => void
}

export function WorkflowControls({ workflowId, workflowName, active, onToggled }: WorkflowControlsProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [toggling, setToggling] = useState(false)

  const handleToggle = () => {
    setShowConfirm(true)
  }

  const confirmToggle = async () => {
    setToggling(true)
    try {
      const res = await fetch(`/api/admin/workflows/${workflowId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      })

      if (!res.ok) throw new Error('Failed to toggle')

      toast.success(`${workflowName} ${active ? 'deactivated' : 'activated'}`)
      onToggled?.()
    } catch {
      toast.error('Failed to toggle workflow. Please try again.')
    } finally {
      setToggling(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={active}
          onCheckedChange={handleToggle}
          disabled={toggling}
        />
        <span className="text-xs text-muted-foreground">
          {active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {active ? 'Deactivate' : 'Activate'} {workflowName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {active
                ? 'This will stop the workflow from executing. It can be reactivated at any time.'
                : 'This will enable the workflow to start executing again.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={toggling}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle} disabled={toggling}>
              {toggling ? 'Processing...' : active ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
