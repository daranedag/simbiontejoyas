import Link from 'next/link'
import type { ReactNode } from 'react'
import type { AdminUser } from '../lib/admin-auth'
import { signOut } from '../app/admin/actions'
import { getAdminPath } from '../lib/admin-routes'

export async function AdminShell({ children, user }: { children: ReactNode; user: AdminUser }) {
  const [homePath, contentPath, collectionsPath, imagesPath] = await Promise.all([
    getAdminPath('/'),
    getAdminPath('/content'),
    getAdminPath('/collections'),
    getAdminPath('/images'),
  ])

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href={homePath}>Simbionte <span>admin</span></Link>
        <nav aria-label="Administración">
          <Link href={homePath}>Resumen</Link>
          <Link href={contentPath}>Textos y secciones</Link>
          <Link href={collectionsPath}>Colecciones</Link>
          <Link href={imagesPath}>Fotografías</Link>
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
