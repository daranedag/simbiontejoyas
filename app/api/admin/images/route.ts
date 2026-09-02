import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '../../../../lib/admin-auth'
import { createInsForgeAdminClient } from '../../../../lib/insforge/server'

type ImagePayload = {
  providerFileId?: unknown
  providerFilePath?: unknown
  fileName?: unknown
  url?: unknown
  thumbnailUrl?: unknown
  mimeType?: unknown
  width?: unknown
  height?: unknown
  fileSizeBytes?: unknown
  title?: unknown
  altText?: unknown
  caption?: unknown
}

function text(value: unknown, maxLength = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function positiveInteger(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : null
}

export async function POST(request: Request) {
  const currentAdmin = await getCurrentAdmin()
  if (!currentAdmin) {
    return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
  }

  let payload: ImagePayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: 'La carga no es válida.' }, { status: 400 })
  }

  const providerFileId = text(payload.providerFileId)
  const fileName = text(payload.fileName)
  const url = text(payload.url, 2048)

  if (!providerFileId || !fileName || !url.startsWith('https://')) {
    return NextResponse.json({ message: 'Faltan los datos de ImageKit.' }, { status: 400 })
  }

  const admin = createInsForgeAdminClient()
  const { data, error } = await admin.database
    .from('images')
    .insert([
      {
        provider: 'imagekit',
        provider_file_id: providerFileId,
        provider_file_path: text(payload.providerFilePath, 2048) || null,
        file_name: fileName,
        url,
        thumbnail_url: text(payload.thumbnailUrl, 2048) || null,
        mime_type: text(payload.mimeType, 255) || null,
        width: positiveInteger(payload.width),
        height: positiveInteger(payload.height),
        file_size_bytes: positiveInteger(payload.fileSizeBytes),
        title: text(payload.title, 200),
        alt_text: text(payload.altText, 500),
        caption: text(payload.caption, 1000),
        status: 'draft',
      },
    ])
    .select('id, url, thumbnail_url, title, alt_text, status')
    .single()

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  return NextResponse.json({ image: data }, { status: 201 })
}
