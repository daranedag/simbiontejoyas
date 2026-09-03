import { headers } from 'next/headers'

const productionAdminHost = 'admin.simbiontejoyas.cl'
const localAdminHost = 'admin.localhost'

function hostWithoutPort(host: string | null) {
  return (host ?? '').toLowerCase().replace(/:\d+$/, '')
}

function portFromHost(host: string | null) {
  return host?.match(/:(\d+)$/)?.[1]
}

function normalizePath(path: string) {
  if (path === '/') return ''
  return path.startsWith('/') ? path : `/${path}`
}

export function adminPathForHost(host: string | null, path: string) {
  const normalizedPath = normalizePath(path)
  const isLocalDevelopment = ['localhost', '127.0.0.1', '[::1]'].includes(hostWithoutPort(host))

  return isLocalDevelopment ? `/admin${normalizedPath}` : normalizedPath || '/'
}

export function adminOriginForHost(host: string | null) {
  const hostname = hostWithoutPort(host)
  const port = portFromHost(host)

  if (['localhost', '127.0.0.1', '[::1]'].includes(hostname)) {
    return `http://${localAdminHost}${port ? `:${port}` : ''}`
  }

  if (hostname === localAdminHost) {
    return `http://${host}`
  }

  if (hostname === productionAdminHost) {
    return `https://${host}`
  }

  return `https://${productionAdminHost}`
}

export async function getAdminPath(path: string) {
  const requestHeaders = await headers()
  return adminPathForHost(requestHeaders.get('host'), path)
}

export async function getRequestOrigin() {
  const requestHeaders = await headers()
  const host = (requestHeaders.get('host') ?? requestHeaders.get('x-forwarded-host'))
    ?.split(',')[0]
    ?.trim()

  if (host) {
    return adminOriginForHost(host)
  }

  return process.env.NEXT_PUBLIC_APP_URL || `https://${productionAdminHost}`
}
