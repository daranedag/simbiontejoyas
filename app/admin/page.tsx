import Link from 'next/link'
import { AdminShell } from '../../components/admin-shell'
import { requireAdmin } from '../../lib/admin-auth'
import { createInsForgeAdminClient } from '../../lib/insforge/server'

async function count(table: string) {
  const admin = createInsForgeAdminClient()
  const { count: total, error } = await admin.database.from(table).select('id', { count: 'exact' })

  if (error) {
    throw new Error(error.message)
  }

  return total ?? 0
}

export default async function AdminHomePage() {
  const user = await requireAdmin()
  const [texts, collections, images] = await Promise.all([
    count('page_texts'),
    count('collections'),
    count('images'),
  ])

  return (
    <AdminShell user={user}>
      <header className="admin-page-heading">
        <p className="admin-kicker">Simbionte Joyas</p>
        <h1>Todo el contenido, en un lugar.</h1>
        <p>Los cambios publicados se reflejan en el sitio público al instante.</p>
      </header>

      <section className="admin-stat-grid" aria-label="Resumen de contenido">
        <Link href="/content"><strong>{texts}</strong><span>textos editables</span></Link>
        <Link href="/collections"><strong>{collections}</strong><span>colecciones</span></Link>
        <Link href="/images"><strong>{images}</strong><span>fotografías</span></Link>
      </section>

      <section className="admin-card admin-intro-card">
        <p className="admin-kicker">Cómo trabajar</p>
        <h2>Primero carga y describe tus fotografías; luego asócialas a una colección o sección.</h2>
        <p>El estado <b>Borrador</b> mantiene el contenido fuera del sitio. Al cambiarlo a <b>Publicado</b>, quedará disponible en la web.</p>
      </section>
    </AdminShell>
  )
}
