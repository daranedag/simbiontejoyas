import { AdminShell } from '../../../components/admin-shell'
import { requireAdmin } from '../../../lib/admin-auth'
import type { CmsImage } from '../../../lib/cms'
import { createInsForgeAdminClient } from '../../../lib/insforge/server'
import {
  attachImageToProject,
  createProject,
  deleteProject,
  detachImageFromProject,
  updateProject,
} from '../actions'

type Project = {
  id: string
  name: string
  slug: string
  description: string
  status: 'draft' | 'published' | 'archived'
  sort_order: number
}

type ProjectImage = {
  id: string
  project_id: string
  image_id: string
  position: number
  is_cover: boolean
  images: CmsImage | CmsImage[] | null
}

export default async function ProjectsPage() {
  const user = await requireAdmin()
  const admin = createInsForgeAdminClient()
  const [projectsResult, imagesResult, relationsResult] = await Promise.all([
    admin.database
      .from('projects')
      .select('id, name, slug, description, status, sort_order')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(100),
    admin.database
      .from('images')
      .select('id, url, thumbnail_url, alt_text, title, width, height')
      .order('created_at', { ascending: false })
      .limit(200),
    admin.database
      .from('project_images')
      .select('id, project_id, image_id, position, is_cover, images(id, url, thumbnail_url, alt_text, title, width, height)')
      .order('position', { ascending: true })
      .limit(500),
  ])

  for (const result of [projectsResult, imagesResult, relationsResult]) {
    if (result.error) throw new Error(result.error.message)
  }

  const projects = (projectsResult.data ?? []) as Project[]
  const images = (imagesResult.data ?? []) as CmsImage[]
  const relations = (relationsResult.data ?? []) as ProjectImage[]

  return (
    <AdminShell user={user}>
      <header className="admin-page-heading">
        <p className="admin-kicker">Obra</p>
        <h1>Proyectos.</h1>
        <p>Crea proyectos, ordénalos y escoge las fotografías que se mostrarán en la sección pública.</p>
      </header>

      <section className="admin-card">
        <h2>Nuevo proyecto</h2>
        <form action={createProject} className="admin-grid-form">
          <label>Nombre<input name="name" required /></label>
          <label>URL amigable<input name="slug" placeholder="se crea desde el nombre si se deja vacía" /></label>
          <label>Orden<input defaultValue="0" min="0" name="sort_order" type="number" /></label>
          <label>Estado
            <select defaultValue="draft" name="status">
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </label>
          <label className="admin-field-wide">Descripción<textarea name="description" rows={3} /></label>
          <button className="admin-button" type="submit">Crear proyecto</button>
        </form>
      </section>

      <div className="admin-section-list">
        {projects.map((project) => {
          const projectImages = relations
            .filter((relation) => relation.project_id === project.id)
            .sort((a, b) => a.position - b.position)

          return (
            <section className="admin-card" key={project.id}>
              <div className="admin-card-title-row">
                <h2>{project.name}</h2>
                <span className={`admin-status admin-status-${project.status}`}>{project.status}</span>
              </div>

              <form action={updateProject} className="admin-grid-form">
                <input name="id" type="hidden" value={project.id} />
                <label>Nombre<input defaultValue={project.name} name="name" required /></label>
                <label>URL amigable<input defaultValue={project.slug} name="slug" required /></label>
                <label>Orden<input defaultValue={project.sort_order} min="0" name="sort_order" type="number" /></label>
                <label>Estado
                  <select defaultValue={project.status} name="status">
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </label>
                <label className="admin-field-wide">Descripción<textarea defaultValue={project.description} name="description" rows={3} /></label>
                <button className="admin-button" type="submit">Guardar proyecto</button>
              </form>

              <div className="admin-collection-images">
                <h3>Fotografías asociadas</h3>
                {projectImages.length === 0 ? (
                  <p className="admin-empty">Aún no hay fotografías en este proyecto.</p>
                ) : (
                  <div className="admin-image-chip-list">
                    {projectImages.map((relation) => {
                      const image = Array.isArray(relation.images) ? relation.images[0] : relation.images
                      if (!image) return null

                      return (
                        <article className="admin-image-chip" key={relation.id}>
                          <img alt={image.alt_text || ''} src={image.thumbnail_url || image.url} />
                          <div>
                            <strong>{image.title || 'Sin título'}</strong>
                            <span>Posición {relation.position}{relation.is_cover ? ' · Portada' : ''}</span>
                          </div>
                          <form action={detachImageFromProject}>
                            <input name="id" type="hidden" value={relation.id} />
                            <button className="admin-text-button admin-danger" type="submit">Quitar</button>
                          </form>
                        </article>
                      )
                    })}
                  </div>
                )}
              </div>

              <form action={attachImageToProject} className="admin-attach-form">
                <input name="project_id" type="hidden" value={project.id} />
                <label>Agregar fotografía
                  <select defaultValue="" name="image_id" required>
                    <option disabled value="">Selecciona una fotografía</option>
                    {images.map((image) => <option key={image.id} value={image.id}>{image.title || image.alt_text || image.id}</option>)}
                  </select>
                </label>
                <label>Posición<input defaultValue={projectImages.length} min="0" name="sort_order" type="number" /></label>
                <label className="admin-check"><input name="is_cover" type="checkbox" /> Usar como portada</label>
                <button className="admin-button admin-button-secondary" type="submit">Agregar</button>
              </form>

              <form action={deleteProject} className="admin-delete-form">
                <input name="id" type="hidden" value={project.id} />
                <button className="admin-text-button admin-danger" type="submit">Eliminar proyecto</button>
              </form>
            </section>
          )
        })}
      </div>
    </AdminShell>
  )
}
