import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

const symbol = readFile(join(process.cwd(), 'src', 'assets', 'simbionte-symbol-2177cp.png'))

function toDataUrl(image: Buffer) {
  return `data:image/png;base64,${image.toString('base64')}`
}

export default async function Icon() {
  const symbolDataUrl = toDataUrl(await symbol)

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#000000',
          display: 'flex',
          height: 64,
          justifyContent: 'center',
          width: 64,
        }}
      >
        <img alt="" height={64} src={symbolDataUrl} style={{ objectFit: 'contain' }} width={64} />
      </div>
    ),
    size,
  )
}
