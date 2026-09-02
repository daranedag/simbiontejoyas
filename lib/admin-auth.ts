import { redirect } from 'next/navigation'
import { createInsForgeServerClient } from './insforge/server'

function allowedEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

export type AdminUser = {
  id: string
  email: string
  name: string
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.auth.getCurrentUser()
  const user = data?.user
  const email = user?.email?.trim().toLowerCase()

  if (error || !user || !email || !allowedEmails().has(email)) {
    return null
  }

  return {
    id: user.id,
    email,
    name: user.profile?.name?.trim() || email,
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/login')
  }

  return admin
}
