import { createAdminClient } from '@insforge/sdk'
import { createServerClient } from '@insforge/sdk/ssr'
import { cookies } from 'next/headers'

function requiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name}.`)
  }

  return value
}

export async function createInsForgeServerClient() {
  return createServerClient({ cookies: await cookies() })
}

export function createInsForgeAdminClient() {
  return createAdminClient({
    baseUrl: requiredEnv('NEXT_PUBLIC_INSFORGE_URL'),
    apiKey: requiredEnv('INSFORGE_API_KEY'),
  })
}
