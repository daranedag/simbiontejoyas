import { createHmac } from 'node:crypto'

export function createImageKitSignature(token: string, expire: number) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY

  if (!privateKey) {
    throw new Error('Falta IMAGEKIT_PRIVATE_KEY.')
  }

  return createHmac('sha1', privateKey).update(`${token}${expire}`).digest('hex')
}
