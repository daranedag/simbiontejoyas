import { AdminShell } from '../../../components/admin-shell'
import { ImageUploader } from '../../../components/image-uploader'
import { ImageKitLibraryPicker } from '../../../components/imagekit-library-picker'
import { requireAdmin } from '../../../lib/admin-auth'
import type { CmsImage, SectionImage } from '../../../lib/cms'
import { createInsForgeAdminClient } from '../../../lib/insforge/server'
import { assignImageToSection, deleteImage, removeImageFromSection, updateImage } from '../actions'

type AdminImage = CmsImage & {
  provider_file_id: string
  file_name: string
  caption: string
  status: 'draft' | 'published' | 'archived'
}

const sectionTargets = [
  { section: 'hero', slot: 'background', label: 'Portada · imagen de fondo' },
  { section: 'about', slot: 'gallery', label: 'Sobre mí · carrusel' },
  { section: 'process', slot: 'card', label: 'Proceso · tarjeta' },
]

export default async function ImagesPage() {
  const user = await requireAdmin()
  const admin = createInsForgeAdminClient()
  const [imagesResult, sectionImagesResult] = await Promise.all([
    admin.database
      .from('images')
      .select('id, provider_file_id, file_name, url, thumbnail_url, alt_text, title, caption, status, width, height')
      .order('created_at', { ascending: false })
      .limit(200),
    admin.database
      .from('section_images')
      .select('id, page_key, section_key, slot_key, position, image_id, images(id, url, thumbnail_url, alt_text, title, width, height)')
      .eq('page_key', 'home')
      .order('section_key', { ascending: true })
      .order('position', { ascending: true })
      .limit(100),
  ])

  if (imagesResult.error) throw new Error(imagesResult.error.message)
  if (sectionImagesResult.error) throw new Error(sectionImagesResult.error.message)

  const images = (imagesResult.data ?? []) as AdminImage[]
  const sectionImages = (sectionImagesResult.data ?? []) as SectionImage[]

  return (
    <AdminShell user={user}>
      <header className="admin-page-heading">
        <p className="admin-kicker">Biblioteca</p>
        <h1>Fotografías.</h1>
        <p>Las cargas se alojan directamente en ImageKit. Antes de aparecer en la web, cada imagen debe estar publicada y asociada a una sección o colección.</p>
      </header>

      <section className="admin-card">
        <h2>Subir una fotografía</h2>
        <ImageUploader />
      </section>

      <section className="admin-card admin-imagekit-library-card">
        <h2>Elegir desde ImageKit</h2>
        <ImageKitLibraryPicker />
      </section>

      <section className="admin-card">
        <h2>Fotos usadas en secciones</h2>
        {sectionImages.length === 0 ? (
          <p className="admin-empty">Aún no hay fotografías asignadas a las secciones fijas de la página.</p>
        ) : (
          <div className="admin-image-chip-list">
            {sectionImages.map((relation) => {
              const image = Array.isArray(relation.images) ? relation.images[0] : relation.images
              if (!image) return null
              return (
                <article className="admin-image-chip" key={relation.id}>
                  <img alt={image.alt_text || ''} src={image.thumbnail_url || image.url} />
                  <div>
                    <strong>{image.title || 'Sin título'}</strong>
                    <span>{relation.section_key} · {relation.slot_key} · posición {relation.position}</span>
                  </div>
                  <form action={removeImageFromSection}>
                    <input name="id" type="hidden" value={relation.id} />
                    <button className="admin-text-button admin-danger" type="submit">Quitar</button>
                  </form>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <div className="admin-image-library">
        {images.map((image) => (
          <article className="admin-card admin-image-editor" key={image.id}>
            <img alt={image.alt_text || ''} className="admin-image-preview" src={image.thumbnail_url || image.url} />
            <div className="admin-image-editor-content">
              <div className="admin-card-title-row">
                <h2>{image.title || image.file_name}</h2>
                <span className={`admin-status admin-status-${image.status}`}>{image.status}</span>
              </div>
              <form action={updateImage} className="admin-grid-form">
                <input name="id" type="hidden" value={image.id} />
                <label>Título<input defaultValue={image.title} name="title" /></label>
                <label>Estado
                  <select defaultValue={image.status} name="status">
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </label>
                <label className="admin-field-wide">Texto alternativo<input defaultValue={image.alt_text} name="alt_text" /></label>
                <label className="admin-field-wide">Pie de foto<textarea defaultValue={image.caption} name="caption" rows={2} /></label>
                <button className="admin-button" type="submit">Guardar fotografía</button>
              </form>

              <form action={assignImageToSection} className="admin-attach-form">
                <input name="image_id" type="hidden" value={image.id} />
                <label>Usar en
                  <select defaultValue="hero|background" name="section_target">
                    {sectionTargets.map((target) => <option key={`${target.section}|${target.slot}`} value={`${target.section}|${target.slot}`}>{target.label}</option>)}
                  </select>
                </label>
                <label>Posición<input defaultValue="0" min="0" name="sort_order" type="number" /></label>
                <button className="admin-button admin-button-secondary" type="submit">Asignar a sección</button>
              </form>

              <form action={deleteImage} className="admin-delete-form">
                <input name="id" type="hidden" value={image.id} />
                <button className="admin-text-button admin-danger" type="submit">Eliminar fotografía</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  )
}
