import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentAdmin } from '../../../../../lib/admin-auth'
import { getImageKitImage } from '../../../../../lib/imagekit'
import { createInsForgeAdminClient } from '../../../../../lib/insforge/server'

export async function POST(request: NextRequest) {
  const currentAdmin = await getCurrentAdmin()
  if (!currentAdmin) {
    return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
  }

  let fileId = ''
  try {
    const payload = await request.json()
    fileId = typeof payload?.fileId === 'string' ? payload.fileId : ''
  } catch {
    return NextResponse.json({ message: 'El archivo seleccionado no es válido.' }, { status: 400 })
  }

  const admin = createInsForgeAdminClient()
  const { data: existing, error: existingError } = await admin.database
    .from('images')
    .select('id, url, thumbnail_url, title, alt_text, status')
    .eq('provider', 'imagekit')
    .eq('provider_file_id', fileId)
    .maybeSingle()

  if (existingError) {
    return NextResponse.json({ message: existingError.message }, { status: 400 })
  }

  if (existing) {
    return NextResponse.json({ image: existing, alreadyImported: true })
  }

  try {
    const asset = await getImageKitImage(fileId)
    const { data, error } = await admin.database
      .from('images')
      .insert([
        {
          provider: 'imagekit',
          provider_file_id: asset.fileId,
          provider_file_path: asset.filePath || null,
          file_name: asset.name,
          url: asset.url,
          thumbnail_url: asset.thumbnailUrl,
          mime_type: asset.mimeType,
          width: asset.width,
          height: asset.height,
          file_size_bytes: asset.size,
          title: asset.name,
          alt_text: '',
          caption: '',
          status: 'draft',
        },
      ])
      .select('id, url, thumbnail_url, title, alt_text, status')
      .single()

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ image: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'No fue posible importar el archivo.' },
      { status: 400 },
    )
  }
}
