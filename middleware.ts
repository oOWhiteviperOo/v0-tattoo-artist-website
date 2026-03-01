import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

// Custom domain → studio slug mappings
// Loaded statically for edge runtime compatibility (no fs access in middleware)
// Add entries as studios sign up with custom domains
import domains from '@/data/domains.json'

const APEX_DOMAIN = 'apexaisystems.co.uk'

export default auth((req) => {
  const hostname = req.headers.get('host') || ''
  const pathname = req.nextUrl.pathname

  // === Admin auth (existing logic) ===
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isLoginPage = pathname === '/admin/login'
  const isAuthenticated = !!req.auth

  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
    }
    return NextResponse.next()
  }

  if ((isAdminRoute || isAdminApi) && !isAuthenticated) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  // === Custom domain routing ===
  // Skip for main domain, www, admin, api, and static assets
  if (isAdminRoute || isAdminApi || pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Check custom domain mapping (e.g., ironinktattoo.co.uk → /iron-ink-tattoo)
  const customDomains = domains as Record<string, string>
  const slug = customDomains[hostname] || customDomains[hostname.replace(/^www\./, '')]
  if (slug && (pathname === '/' || pathname === '')) {
    return NextResponse.rewrite(new URL(`/${slug}`, req.url))
  }

  // Check subdomain (e.g., ironink.apexaisystems.co.uk → /ironink)
  if (hostname.endsWith(`.${APEX_DOMAIN}`) && !hostname.startsWith('www.') && !hostname.startsWith('n8n.')) {
    const subdomain = hostname.replace(`.${APEX_DOMAIN}`, '')
    if (subdomain && (pathname === '/' || pathname === '')) {
      return NextResponse.rewrite(new URL(`/${subdomain}`, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all routes except static files and images
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
