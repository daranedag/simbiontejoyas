import Link from 'next/link'
import { AdminShell } from '../../components/admin-shell'
import { requireAdmin } from '../../lib/admin-auth'
import { SITE_VISIBILITY_KEY } from '../../lib/cms'
import { createInsForgeAdminClient } from '../../lib/insforge/server'
import { updateSiteVisibility } from './actions'

async function count(table: string) {
  const admin = createInsForgeAdminClient()
  const { count: total, error } = await admin.database.from(table).select('id', { count: 'exact' })

  if (error) {
    throw new Error(error.message)
  }

  return total ?? 0
}

async function getSiteVisibility() {
  const admin = createInsForgeAdminClient()
  const { data, error } = await admin.database
    .from('page_texts')
    .select('content')
    .eq('content_key', SITE_VISIBILITY_KEY)
    .eq('locale', 'es-CL')
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data?.content === 'construction' ? 'construction' : 'published'
}

export default async function AdminHomePage() {
  const user = await requireAdmin()
  const [siteVisibility, texts, collections, projects, images] = await Promise.all([
    getSiteVisibility(),
    count('page_texts'),
    count('collections'),
    count('projects'),
    count('images'),
  ])
  const isPublished = siteVisibility === 'published'

  return (
    <AdminShell user={user}>
      <header className="admin-page-heading">
        <p className="admin-kicker">Simbionte Joyas</p>
        <h1>Todo el contenido, en un lugar.</h1>
        <p>Los cambios publicados se reflejan en el sitio público al instante.</p>
      </header>

      <section className={`admin-card admin-visibility-card${isPublished ? ' is-published' : ''}`}>
        <div>
          <p className="admin-kicker">Visibilidad del sitio</p>
          <h2>{isPublished ? 'Sitio publicado' : 'Sitio en construcción'}</h2>
          <p>
            {isPublished
              ? 'El sitio completo está visible para todas las personas.'
              : 'Las visitas ven una portada temporal mientras tú sigues trabajando desde el panel.'}
          </p>
        </div>
        <form action={updateSiteVisibility}>
          <input name="mode" type="hidden" value={isPublished ? 'construction' : 'published'} />
          <button
            aria-checked={isPublished}
            aria-label={isPublished ? 'Ocultar el sitio público' : 'Publicar el sitio'}
            className="admin-visibility-switch"
            role="switch"
            type="submit"
          >
            <span aria-hidden="true" />
          </button>
          <small>{isPublished ? 'Publicado' : 'En construcción'}</small>
        </form>
      </section>

      <section className="admin-stat-grid" aria-label="Resumen de contenido">
        <Link href="/content"><strong>{texts}</strong><span>textos editables</span></Link>
        <Link href="/collections"><strong>{collections}</strong><span>colecciones</span></Link>
        <Link href="/projects"><strong>{projects}</strong><span>proyectos</span></Link>
        <Link href="/images"><strong>{images}</strong><span>fotografías</span></Link>
      </section>

      <section className="admin-card admin-intro-card">
        <p className="admin-kicker">Cómo trabajar</p>
        <h2>Primero carga y describe tus fotografías; luego asócialas a una colección, proyecto o sección.</h2>
        <p>El estado <b>Borrador</b> mantiene el contenido fuera del sitio. Al cambiarlo a <b>Publicado</b>, quedará disponible en la web.</p>
      </section>
    </AdminShell>
  )
}
