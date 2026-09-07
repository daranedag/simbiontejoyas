import { AdminPreviewCanvas } from '../../../components/admin-preview-canvas'
import { requireAdmin } from '../../../lib/admin-auth'
import { getPublicSiteContent } from '../../../lib/cms'

export default async function AdminPreviewPage() {
  await requireAdmin()
  const content = await getPublicSiteContent()

  return <AdminPreviewCanvas initialContent={content} />
}
