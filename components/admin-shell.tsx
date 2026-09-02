import Link from 'next/link'
import type { ReactNode } from 'react'
import type { AdminUser } from '../lib/admin-auth'
import { signOut } from '../app/admin/actions'

export function AdminShell({ children, user }: { children: ReactNode; user: AdminUser }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">Simbionte <span>admin</span></Link>
        <nav aria-label="Administración">
          <Link href="/">Resumen</Link>
          <Link href="/content">Textos y secciones</Link>
          <Link href="/collections">Colecciones</Link>
          <Link href="/images">Fotografías</Link>
        </nav>
        <div className="admin-account">
          <p>{user.name}</p>
          <span>{user.email}</span>
          <form action={signOut}>
            <button type="submit">Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
