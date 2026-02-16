'use client'

import { SWRConfig } from 'swr'
import { toast } from 'sonner'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        onError: (error) => {
          toast.error(error.message || 'Something went wrong')
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
