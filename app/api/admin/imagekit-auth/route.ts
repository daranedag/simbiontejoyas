import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '../../../../lib/admin-auth'
import { createImageKitSignature } from '../../../../lib/imagekit'

export async function GET() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
  }

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
  if (!publicKey) {
    return NextResponse.json({ message: 'ImageKit no está configurado.' }, { status: 503 })
  }

  const token = randomUUID()
  const expire = Math.floor(Date.now() / 1000) + 20 * 60

  return NextResponse.json({
    token,
    expire,
    signature: createImageKitSignature(token, expire),
    publicKey,
    folder: process.env.IMAGEKIT_FOLDER || '/simbiontejoyas',
  })
}
