import { createClient } from '@insforge/sdk'
import type { PortfolioItem } from '../src/data'

export type PageText = {
  id: string
  content_key: string
  admin_label: string
  content: string
  content_format: 'plain' | 'markdown'
  status: 'draft' | 'published' | 'archived'
  section_key: string
  sort_order: number
}

export type CmsImage = {
  id: string
  url: string
  thumbnail_url: string | null
  alt_text: string
  title: string
  width: number | null
  height: number | null
}

export type SectionImage = {
  id: string
  page_key: string
  section_key: string
  slot_key: string
  position: number
  image_id: string
  images: CmsImage | CmsImage[] | null
}

export type PublicSiteContent = {
  texts: Record<string, string>
  portfolio: PortfolioItem[] | null
  sectionImages: SectionImage[]
}

function publicClient() {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY

  if (!baseUrl || !anonKey) {
    return null
  }

  return createClient({ baseUrl, anonKey })
}

export async function getPublicSiteContent(): Promise<PublicSiteContent> {
  const client = publicClient()

  if (!client) {
    return { texts: {}, portfolio: null, sectionImages: [] }
  }

  try {
    const [textsResult, collectionsResult, sectionImagesResult] = await Promise.all([
      client.database
        .from('page_texts')
        .select('content_key, content')
        .eq('page_key', 'home')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .limit(100),
      client.database
        .from('collections')
        .select('id, name, sort_order, collection_images(position, images(id, url, thumbnail_url, alt_text, title, width, height))')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .limit(30),
      client.database
        .from('section_images')
        .select('id, page_key, section_key, slot_key, position, image_id, images(id, url, thumbnail_url, alt_text, title, width, height)')
        .eq('page_key', 'home')
        .order('position', { ascending: true })
        .limit(50),
    ])

    const texts = Object.fromEntries(
      ((textsResult.data ?? []) as Array<{ content_key: string; content: string }>).map((item) => [
        item.content_key,
        item.content,
      ]),
    )

    const portfolio = ((collectionsResult.data ?? []) as Array<{
      id: string
      name: string
      collection_images: Array<{ position: number; images: CmsImage | CmsImage[] | null }>
    }>)
      .flatMap((collection) =>
        (collection.collection_images ?? [])
          .sort((a, b) => a.position - b.position)
          .map((association) => {
            const image = Array.isArray(association.images)
              ? association.images[0]
              : association.images

            if (!image) {
              return null
            }

            return {
              id: image.id,
              title: image.title || collection.name,
              alt: image.alt_text || collection.name,
              image: image.url,
              width: image.width ?? 1600,
              height: image.height ?? 1600,
            } satisfies PortfolioItem
          }),
      )
      .filter((item): item is PortfolioItem => item !== null)

    return {
      texts,
      portfolio: portfolio.length > 0 ? portfolio : null,
      sectionImages: (sectionImagesResult.data ?? []) as SectionImage[],
    }
  } catch (error) {
    console.error('No fue posible cargar el contenido público desde InsForge.', error)
    return { texts: {}, portfolio: null, sectionImages: [] }
  }
}
