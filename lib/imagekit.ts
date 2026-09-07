import { createHmac } from 'node:crypto'

export type ImageKitLibraryFolder = {
  name: string
  path: string
}

export type ImageKitLibraryImage = {
  fileId: string
  filePath: string
  name: string
  url: string
  thumbnailUrl: string | null
  mimeType: string | null
  width: number | null
  height: number | null
  size: number | null
}

type ImageKitAsset = Record<string, unknown>

export function createImageKitSignature(token: string, expire: number) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY

  if (!privateKey) {
    throw new Error('Falta IMAGEKIT_PRIVATE_KEY.')
  }

  return createHmac('sha1', privateKey).update(`${token}${expire}`).digest('hex')
}

function imageKitAuthorization() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY

  if (!privateKey) {
    throw new Error('Falta IMAGEKIT_PRIVATE_KEY.')
  }

  return `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`
}

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function positiveInteger(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : null
}

function normalizeFolderPath(path: string) {
  const normalized = path.trim().replace(/\\/g, '/')

  if (!normalized || normalized === '/') return '/'
  if (!normalized.startsWith('/') || normalized.includes('..')) {
    throw new Error('La carpeta de ImageKit no es válida.')
  }

  return normalized.replace(/\/+$/, '') || '/'
}

function folderPath(asset: ImageKitAsset, currentPath: string) {
  const fromApi = text(asset.folderPath) || text(asset.filePath)
  if (fromApi) return normalizeFolderPath(fromApi)

  const name = text(asset.name)
  return normalizeFolderPath(`${currentPath === '/' ? '' : currentPath}/${name}`)
}

async function imageKitRequest(pathname: string, searchParams?: URLSearchParams) {
  const url = new URL(`https://api.imagekit.io/v1/${pathname}`)
  searchParams?.forEach((value, key) => url.searchParams.set(key, value))

  const response = await fetch(url, {
    headers: { authorization: imageKitAuthorization() },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('ImageKit no permitió acceder a su biblioteca.')
  }

  return response.json() as Promise<unknown>
}

function toLibraryImage(asset: ImageKitAsset): ImageKitLibraryImage | null {
  const fileId = text(asset.fileId)
  const url = text(asset.url)
  const name = text(asset.name)

  if (!fileId || !url.startsWith('https://') || !name) return null

  return {
    fileId,
    filePath: text(asset.filePath),
    name,
    url,
    thumbnailUrl: text(asset.thumbnailUrl) || null,
    mimeType: text(asset.mime) || text(asset.fileType) || null,
    width: positiveInteger(asset.width),
    height: positiveInteger(asset.height),
    size: positiveInteger(asset.size),
  }
}

export async function listImageKitLibrary(path: string) {
  const currentPath = normalizeFolderPath(path)
  const baseParams = new URLSearchParams({ path: currentPath, limit: '500', skip: '0' })
  const folderParams = new URLSearchParams(baseParams)
  folderParams.set('type', 'folder')
  const imageParams = new URLSearchParams(baseParams)
  imageParams.set('type', 'file')
  imageParams.set('fileType', 'image')
  imageParams.set('sort', 'DESC_UPDATED')

  const [folderResponse, imageResponse] = await Promise.all([
    imageKitRequest('files', folderParams),
    imageKitRequest('files', imageParams),
  ])
  const folders = Array.isArray(folderResponse) ? folderResponse : []
  const images = Array.isArray(imageResponse) ? imageResponse : []

  return {
    path: currentPath,
    folders: folders
      .filter((asset): asset is ImageKitAsset => Boolean(asset) && typeof asset === 'object')
      .map((asset) => ({ name: text(asset.name), path: folderPath(asset, currentPath) }))
      .filter((folder) => folder.name && folder.path),
    images: images
      .filter((asset): asset is ImageKitAsset => Boolean(asset) && typeof asset === 'object')
      .map(toLibraryImage)
      .filter((asset): asset is ImageKitLibraryImage => asset !== null),
  }
}

export async function getImageKitImage(fileId: string) {
  if (!/^[a-zA-Z0-9_-]{1,255}$/.test(fileId)) {
    throw new Error('El archivo de ImageKit no es válido.')
  }

  const result = await imageKitRequest(`files/${encodeURIComponent(fileId)}/details`)
  if (!result || typeof result !== 'object') {
    throw new Error('ImageKit no devolvió los datos del archivo.')
  }

  const asset = toLibraryImage(result as ImageKitAsset)
  if (!asset || !text((result as ImageKitAsset).fileType).startsWith('image')) {
    throw new Error('El archivo elegido no es una imagen válida.')
  }

  return asset
}
