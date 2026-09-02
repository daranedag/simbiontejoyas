import { AdminShell } from '../../../components/admin-shell'
import { requireAdmin } from '../../../lib/admin-auth'
import type { PageText } from '../../../lib/cms'
import { createInsForgeAdminClient } from '../../../lib/insforge/server'
import { updatePageText } from '../actions'

export default async function ContentPage() {
  const user = await requireAdmin()
  const admin = createInsForgeAdminClient()
  const { data, error } = await admin.database
    .from('page_texts')
    .select('id, content_key, admin_label, content, content_format, status, section_key, sort_order')
    .eq('page_key', 'home')
    .order('section_key', { ascending: true })
    .order('sort_order', { ascending: true })
    .limit(100)

  if (error) {
    throw new Error(error.message)
  }

  const sections = (data as PageText[]).reduce<Record<string, PageText[]>>((groups, item) => {
    groups[item.section_key] ??= []
    groups[item.section_key].push(item)
    return groups
  }, {})

  return (
    <AdminShell user={user}>
      <header className="admin-page-heading">
        <p className="admin-kicker">Secciones</p>
        <h1>Textos de la página.</h1>
        <p>Edita, guarda y publica cada parte de la portada, obra, proceso, contacto y SEO.</p>
      </header>

      <div className="admin-section-list">
        {Object.entries(sections).map(([sectionKey, items]) => (
          <section className="admin-card" key={sectionKey}>
            <h2>{sectionKey.replace(/(^|[-_])(\w)/g, (_, separator: string, letter: string) => `${separator} ${letter.toUpperCase()}`)}</h2>
            <div className="admin-form-list">
              {items.map((item) => (
                <form className="admin-edit-form" action={updatePageText} key={item.id}>
                  <input name="id" type="hidden" value={item.id} />
                  <div className="admin-field-heading">
                    <label htmlFor={`content-${item.id}`}>{item.admin_label}</label>
                    <code>{item.content_key}</code>
                  </div>
                  <textarea defaultValue={item.content} id={`content-${item.id}`} name="content" rows={item.content.length > 100 ? 5 : 3} />
                  <div className="admin-form-actions">
                    <label>
                      Formato
                      <select defaultValue={item.content_format} name="content_format">
                        <option value="plain">Texto simple</option>
                        <option value="markdown">Énfasis con *asteriscos*</option>
                      </select>
                    </label>
                    <label>
                      Estado
                      <select defaultValue={item.status} name="status">
                        <option value="draft">Borrador</option>
                        <option value="published">Publicado</option>
                        <option value="archived">Archivado</option>
                      </select>
                    </label>
                    <button className="admin-button" type="submit">Guardar</button>
                  </div>
                </form>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  )
}
