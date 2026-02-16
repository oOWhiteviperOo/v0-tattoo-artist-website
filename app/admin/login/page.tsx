import { signIn } from '@/lib/auth/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Apex Admin</CardTitle>
          <CardDescription>
            Sign in with your authorized GitHub account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginError searchParams={searchParams} />
          <form
            action={async () => {
              'use server'
              await signIn('github', { redirectTo: '/admin/dashboard' })
            }}
          >
            <Button type="submit" className="w-full" size="lg">
              Sign in with GitHub
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

async function LoginError({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  if (!params.error) return null

  return (
    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
      {params.error === 'AccessDenied'
        ? 'Your GitHub account is not authorized to access the admin dashboard.'
        : 'An error occurred during sign in. Please try again.'}
    </div>
  )
}
