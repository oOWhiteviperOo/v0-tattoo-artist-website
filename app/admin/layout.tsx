import { auth } from '@/lib/auth/config'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { AdminHeader } from '@/components/admin/layout/AdminHeader'
import { SWRProvider } from '@/components/admin/providers/SWRProvider'
import { Toaster } from '@/components/ui/sonner'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SWRProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader
            userName={session?.user?.name}
            userImage={session?.user?.image}
          />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </SWRProvider>
  )
}
