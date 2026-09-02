import { AdminShell } from '../../../components/admin-shell'
import { requireAdmin } from '../../../lib/admin-auth'
import type { CmsImage } from '../../../lib/cms'
import { createInsForgeAdminClient } from '../../../lib/insforge/server'
import {
  attachImageToCollection,
  createCollection,
  deleteCollection,
  detachImageFromCollection,
  updateCollection,
} from '../actions'

type Collection = {
  id: string
  name: string
  slug: string
  description: string
  status: 'draft' | 'published' | 'archived'
  sort_order: number
}

type CollectionImage = {
  id: string
  collection_id: string
  image_id: string
  position: number
  is_cover: boolean
  images: CmsImage | CmsImage[] | null
}

export default async function CollectionsPage() {
  const user = await requireAdmin()
  const admin = createInsForgeAdminClient()
  const [collectionsResult, imagesResult, relationsResult] = await Promise.all([
    admin.database
      .from('collections')
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
      .from('collection_images')
      .select('id, collection_id, image_id, position, is_cover, images(id, url, thumbnail_url, alt_text, title, width, height)')
      .order('position', { ascending: true })
      .limit(500),
  ])

  for (const result of [collectionsResult, imagesResult, relationsResult]) {
    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  const collections = (collectionsResult.data ?? []) as Collection[]
  const images = (imagesResult.data ?? []) as CmsImage[]
  const relations = (relationsResult.data ?? []) as CollectionImage[]

  return (
    <AdminShell user={user}>
      <header className="admin-page-heading">
        <p className="admin-kicker">Obra</p>
        <h1>Colecciones.</h1>
        <p>Crea grupos de piezas, ordénalos y escoge las fotografías que se mostrarán en la galería pública.</p>
      </header>

      <section className="admin-card">
        <h2>Nueva colección</h2>
        <form action={createCollection} className="admin-grid-form">
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
          <button className="admin-button" type="submit">Crear colección</button>
        </form>
      </section>

      <div className="admin-section-list">
        {collections.map((collection) => {
          const collectionImages = relations
            .filter((relation) => relation.collection_id === collection.id)
            .sort((a, b) => a.position - b.position)

          return (
            <section className="admin-card" key={collection.id}>
              <div className="admin-card-title-row">
                <h2>{collection.name}</h2>
                <span className={`admin-status admin-status-${collection.status}`}>{collection.status}</span>
              </div>

              <form action={updateCollection} className="admin-grid-form">
                <input name="id" type="hidden" value={collection.id} />
                <label>Nombre<input defaultValue={collection.name} name="name" required /></label>
                <label>URL amigable<input defaultValue={collection.slug} name="slug" required /></label>
                <label>Orden<input defaultValue={collection.sort_order} min="0" name="sort_order" type="number" /></label>
                <label>Estado
                  <select defaultValue={collection.status} name="status">
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </label>
                <label className="admin-field-wide">Descripción<textarea defaultValue={collection.description} name="description" rows={3} /></label>
                <button className="admin-button" type="submit">Guardar colección</button>
              </form>

              <div className="admin-collection-images">
                <h3>Fotografías asociadas</h3>
                {collectionImages.length === 0 ? (
                  <p className="admin-empty">Aún no hay fotografías en esta colección.</p>
                ) : (
                  <div className="admin-image-chip-list">
                    {collectionImages.map((relation) => {
                      const image = Array.isArray(relation.images) ? relation.images[0] : relation.images
                      if (!image) return null

                      return (
                        <article className="admin-image-chip" key={relation.id}>
                          <img alt={image.alt_text || ''} src={image.thumbnail_url || image.url} />
                          <div>
                            <strong>{image.title || 'Sin título'}</strong>
                            <span>Posición {relation.position}{relation.is_cover ? ' · Portada' : ''}</span>
                          </div>
                          <form action={detachImageFromCollection}>
                            <input name="id" type="hidden" value={relation.id} />
                            <button className="admin-text-button admin-danger" type="submit">Quitar</button>
                          </form>
                        </article>
                      )
                    })}
                  </div>
                )}
              </div>

              <form action={attachImageToCollection} className="admin-attach-form">
                <input name="collection_id" type="hidden" value={collection.id} />
                <label>Agregar fotografía
                  <select defaultValue="" name="image_id" required>
                    <option disabled value="">Selecciona una fotografía</option>
                    {images.map((image) => <option key={image.id} value={image.id}>{image.title || image.alt_text || image.id}</option>)}
                  </select>
                </label>
                <label>Posición<input defaultValue={collectionImages.length} min="0" name="sort_order" type="number" /></label>
                <label className="admin-check"><input name="is_cover" type="checkbox" /> Usar como portada</label>
                <button className="admin-button admin-button-secondary" type="submit">Agregar</button>
              </form>

              <form action={deleteCollection} className="admin-delete-form">
                <input name="id" type="hidden" value={collection.id} />
                <button className="admin-text-button admin-danger" type="submit">Eliminar colección</button>
              </form>
            </section>
          )
        })}
      </div>
    </AdminShell>
  )
}
