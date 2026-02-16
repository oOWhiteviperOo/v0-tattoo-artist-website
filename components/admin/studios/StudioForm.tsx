'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import type { StudioRow } from '@/lib/google-sheets/types'

const studioSchema = z.object({
  studioName: z.string().min(1, 'Studio name is required'),
  studioEmail: z.string().email('Invalid email address').or(z.literal('')),
  studioPhone: z.string(),
  depositPercent: z.coerce.number().min(0).max(100),
  depositMinGBP: z.coerce.number().min(0),
  cancellationWindowHours: z.coerce.number().min(0),
  active: z.boolean(),
})

type StudioFormValues = z.infer<typeof studioSchema>

interface StudioFormProps {
  studio: StudioRow
  onSaved?: () => void
}

export function StudioForm({ studio, onSaved }: StudioFormProps) {
  const [saving, setSaving] = useState(false)

  const form = useForm<StudioFormValues>({
    resolver: zodResolver(studioSchema),
    defaultValues: {
      studioName: studio.studioName,
      studioEmail: studio.studioEmail,
      studioPhone: studio.studioPhone,
      depositPercent: studio.depositPercent,
      depositMinGBP: studio.depositMinGBP,
      cancellationWindowHours: studio.cancellationWindowHours,
      active: studio.active,
    },
  })

  async function onSubmit(values: StudioFormValues) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/studios/${studio.studioId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error('Failed to update')

      toast.success('Studio updated successfully')
      onSaved?.()
    } catch {
      toast.error('Failed to update studio. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studioName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Studio Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="studioEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studioPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="depositPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit %</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="depositMinGBP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Deposit (£)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cancellationWindowHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancel Window (hrs)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel className="text-sm font-medium">Active</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}
