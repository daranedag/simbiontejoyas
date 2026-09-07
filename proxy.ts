import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@insforge/sdk/ssr/middleware'

const adminHost = 'admin.simbiontejoyas.cl'
const publicHosts = new Set(['simbiontejoyas.cl', 'www.simbiontejoyas.cl'])
const localDevelopmentHosts = new Set(['localhost', '127.0.0.1', '[::1]'])

function hostWithoutPort(request: NextRequest) {
  return (request.headers.get('host') ?? '').toLowerCase().replace(/:\d+$/, '')
}

export async function proxy(request: NextRequest) {
  const host = hostWithoutPort(request)
  const { pathname } = request.nextUrl
  let response: NextResponse

  if (host === adminHost || host === 'admin.localhost') {
    if (pathname.startsWith('/api/') || pathname === '/icon') {
      response = NextResponse.next({ request })
    } else {
      const targetPath = pathname === '/admin' ? '/' : pathname
      response = NextResponse.rewrite(new URL(`/admin${targetPath}`, request.url))
    }
  } else if (localDevelopmentHosts.has(host) && (pathname === '/admin' || pathname.startsWith('/admin/'))) {
    const targetPath = pathname.slice('/admin'.length) || '/'
    const localAdminUrl = new URL(targetPath, request.url)
    localAdminUrl.hostname = 'admin.localhost'
    localAdminUrl.search = request.nextUrl.search
    response = NextResponse.redirect(localAdminUrl)
  } else if (publicHosts.has(host) && (pathname === '/admin' || pathname.startsWith('/admin/'))) {
    const targetPath = pathname.slice('/admin'.length) || '/'
    response = NextResponse.redirect(new URL(targetPath, `https://${adminHost}`))
  } else {
    response = NextResponse.next({ request })
  }

  await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
