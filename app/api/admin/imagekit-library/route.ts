import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentAdmin } from '../../../../lib/admin-auth'
import { listImageKitLibrary } from '../../../../lib/imagekit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
  }

  try {
    const library = await listImageKitLibrary(request.nextUrl.searchParams.get('path') ?? '/')
    return NextResponse.json(library)
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'No fue posible leer ImageKit.' },
      { status: 502 },
    )
  }
}
