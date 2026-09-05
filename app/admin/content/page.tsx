import { AdminShell } from '../../../components/admin-shell'
import { AdminSectionEditor, type AdminImageOption } from '../../../components/admin-section-editor'
import { requireAdmin } from '../../../lib/admin-auth'
import { getAdminPath } from '../../../lib/admin-routes'
import type { PageText, SectionImage } from '../../../lib/cms'
import { createInsForgeAdminClient } from '../../../lib/insforge/server'

export default async function ContentPage() {
  const user = await requireAdmin()
  const admin = createInsForgeAdminClient()
  const [textsResult, imagesResult, sectionImagesResult, previewPath, collectionsPath, imageLibraryPath] = await Promise.all([
    admin.database
      .from('page_texts')
      .select('id, content_key, admin_label, content, content_format, status, section_key, sort_order')
      .eq('page_key', 'home')
      .order('sort_order', { ascending: true })
      .limit(100),
    admin.database
      .from('images')
      .select('id, file_name, url, thumbnail_url, alt_text, title, status, width, height')
      .order('created_at', { ascending: false })
      .limit(200),
    admin.database
      .from('section_images')
      .select('id, page_key, section_key, slot_key, position, image_id, images(id, url, thumbnail_url, alt_text, title, width, height)')
      .eq('page_key', 'home')
      .order('position', { ascending: true })
      .limit(100),
    getAdminPath('/preview'),
    getAdminPath('/collections'),
    getAdminPath('/images'),
  ])

  for (const result of [textsResult, imagesResult, sectionImagesResult]) {
    if (result.error) throw new Error(result.error.message)
  }

  return (
    <AdminShell user={user} wide>
      <header className="admin-page-heading admin-editor-page-heading">
        <div>
          <p className="admin-kicker">Editor visual</p>
          <h1>Edita el sitio por secciones.</h1>
        </div>
        <p>Selecciona una parte de la página, modifica su contenido y revisa el resultado antes de publicarlo.</p>
      </header>

      <AdminSectionEditor
        collectionsPath={collectionsPath}
        imageLibraryPath={imageLibraryPath}
        images={(imagesResult.data ?? []) as AdminImageOption[]}
        items={(textsResult.data ?? []) as PageText[]}
        previewPath={previewPath}
        sectionImages={(sectionImagesResult.data ?? []) as SectionImage[]}
      />
    </AdminShell>
  )
}
