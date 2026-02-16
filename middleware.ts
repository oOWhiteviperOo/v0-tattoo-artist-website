import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const isAuthenticated = !!req.auth

  // Allow login page without auth
  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
    }
    return NextResponse.next()
  }

  // Protect admin routes
  if ((isAdminRoute || isAdminApi) && !isAuthenticated) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
