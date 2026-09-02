'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAuthActions } from '@insforge/sdk/ssr'
import { cookies } from 'next/headers'
import { requireAdmin } from '../../lib/admin-auth'
import { createInsForgeAdminClient } from '../../lib/insforge/server'

const statuses = new Set(['draft', 'published', 'archived'])

function value(formData: FormData, name: string) {
  const field = formData.get(name)
  return typeof field === 'string' ? field.trim() : ''
}

function requiredValue(formData: FormData, name: string) {
  const field = value(formData, name)

  if (!field) {
    throw new Error(`Falta el campo ${name}.`)
  }

  return field
}

function status(valueToCheck: string) {
  return statuses.has(valueToCheck) ? valueToCheck : 'draft'
}

function sortOrder(formData: FormData) {
  const parsed = Number.parseInt(value(formData, 'sort_order'), 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

function slug(valueToTransform: string) {
  return valueToTransform
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function assertNoError(error: { message?: string } | null) {
  if (error) {
    throw new Error(error.message || 'No fue posible guardar los cambios.')
  }
}

function refreshPublicContent() {
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function signInWithGoogle() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl) {
    throw new Error('Falta NEXT_PUBLIC_APP_URL.')
  }

  const cookieStore = await cookies()
  const auth = createAuthActions({ cookies: cookieStore })
  const { data, error } = await auth.signInWithOAuth('google', {
    redirectTo: new URL('/api/auth/callback', appUrl).toString(),
    additionalParams: { prompt: 'select_account' },
    skipBrowserRedirect: true,
  })

  if (error || !data?.url || !data.codeVerifier) {
    throw new Error(error?.message || 'No fue posible iniciar sesión con Google.')
  }

  cookieStore.set('insforge_code_verifier', data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })

  redirect(data.url)
}

export async function signOut() {
  const cookieStore = await cookies()
  const auth = createAuthActions({ cookies: cookieStore })
  const { error } = await auth.signOut()

  assertNoError(error)
  redirect('/login')
}

export async function updatePageText(formData: FormData) {
  await requireAdmin()
  const id = requiredValue(formData, 'id')
  const admin = createInsForgeAdminClient()
  const { error } = await admin.database
    .from('page_texts')
    .update({
      content: value(formData, 'content'),
      content_format: value(formData, 'content_format') === 'markdown' ? 'markdown' : 'plain',
      status: status(value(formData, 'status')),
    })
    .eq('id', id)

  assertNoError(error)
  refreshPublicContent()
  redirect('/content')
}

export async function createCollection(formData: FormData) {
  await requireAdmin()
  const name = requiredValue(formData, 'name')
  const collectionStatus = status(value(formData, 'status'))
  const admin = createInsForgeAdminClient()
  const { error } = await admin.database.from('collections').insert([
    {
      name,
      slug: slug(value(formData, 'slug')) || slug(name),
      description: value(formData, 'description'),
      status: collectionStatus,
      sort_order: sortOrder(formData),
      published_at: collectionStatus === 'published' ? new Date().toISOString() : null,
    },
  ])

  assertNoError(error)
  refreshPublicContent()
  redirect('/collections')
}

export async function updateCollection(formData: FormData) {
  await requireAdmin()
  const id = requiredValue(formData, 'id')
  const name = requiredValue(formData, 'name')
  const collectionStatus = status(value(formData, 'status'))
  const admin = createInsForgeAdminClient()
  const { error } = await admin.database
    .from('collections')
    .update({
      name,
      slug: slug(value(formData, 'slug')) || slug(name),
      description: value(formData, 'description'),
      status: collectionStatus,
      sort_order: sortOrder(formData),
      published_at: collectionStatus === 'published' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  assertNoError(error)
  refreshPublicContent()
  redirect('/collections')
}

export async function deleteCollection(formData: FormData) {
  await requireAdmin()
  const admin = createInsForgeAdminClient()
  const { error } = await admin.database.from('collections').delete().eq('id', requiredValue(formData, 'id'))

  assertNoError(error)
  refreshPublicContent()
  redirect('/collections')
}

export async function attachImageToCollection(formData: FormData) {
  await requireAdmin()
  const collectionId = requiredValue(formData, 'collection_id')
  const imageId = requiredValue(formData, 'image_id')
  const isCover = value(formData, 'is_cover') === 'on'
  const admin = createInsForgeAdminClient()

  if (isCover) {
    const { error } = await admin.database
      .from('collection_images')
      .update({ is_cover: false })
      .eq('collection_id', collectionId)
    assertNoError(error)
  }

  const { error } = await admin.database.from('collection_images').insert([
    {
      collection_id: collectionId,
      image_id: imageId,
      position: sortOrder(formData),
      is_cover: isCover,
    },
  ])

  assertNoError(error)
  refreshPublicContent()
  redirect('/collections')
}

export async function detachImageFromCollection(formData: FormData) {
  await requireAdmin()
  const admin = createInsForgeAdminClient()
  const { error } = await admin.database
    .from('collection_images')
    .delete()
    .eq('id', requiredValue(formData, 'id'))

  assertNoError(error)
  refreshPublicContent()
  redirect('/collections')
}

export async function updateImage(formData: FormData) {
  await requireAdmin()
  const admin = createInsForgeAdminClient()
  const { error } = await admin.database
    .from('images')
    .update({
      title: value(formData, 'title'),
      alt_text: value(formData, 'alt_text'),
      caption: value(formData, 'caption'),
      status: status(value(formData, 'status')),
    })
    .eq('id', requiredValue(formData, 'id'))

  assertNoError(error)
  refreshPublicContent()
  redirect('/images')
}

export async function deleteImage(formData: FormData) {
  await requireAdmin()
  const id = requiredValue(formData, 'id')
  const admin = createInsForgeAdminClient()
  const { data, error: imageError } = await admin.database
    .from('images')
    .select('provider, provider_file_id')
    .eq('id', id)
    .maybeSingle()

  assertNoError(imageError)

  if (!data) {
    redirect('/images')
  }

  if (data.provider === 'imagekit') {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    if (!privateKey) {
      throw new Error('Falta IMAGEKIT_PRIVATE_KEY para eliminar el archivo.')
    }

    const authorization = `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`
    const response = await fetch(
      `https://api.imagekit.io/v1/files/${encodeURIComponent(data.provider_file_id)}`,
      { method: 'DELETE', headers: { authorization } },
    )

    if (!response.ok && response.status !== 404) {
      throw new Error('ImageKit no permitió eliminar la fotografía.')
    }
  }

  const { error } = await admin.database.from('images').delete().eq('id', id)
  assertNoError(error)
  refreshPublicContent()
  redirect('/images')
}

export async function assignImageToSection(formData: FormData) {
  await requireAdmin()
  const pageKey = 'home'
  const [sectionKey, slotKey] = requiredValue(formData, 'section_target').split('|')

  if (!sectionKey || !slotKey || !['hero|background', 'about|gallery', 'process|card'].includes(`${sectionKey}|${slotKey}`)) {
    throw new Error('La sección seleccionada no es válida.')
  }

  const position = sortOrder(formData)
  const admin = createInsForgeAdminClient()

  const { error: removeError } = await admin.database
    .from('section_images')
    .delete()
    .eq('page_key', pageKey)
    .eq('section_key', sectionKey)
    .eq('slot_key', slotKey)
    .eq('position', position)
  assertNoError(removeError)

  const { error } = await admin.database.from('section_images').insert([
    {
      page_key: pageKey,
      section_key: sectionKey,
      slot_key: slotKey,
      position,
      image_id: requiredValue(formData, 'image_id'),
    },
  ])

  assertNoError(error)
  refreshPublicContent()
  redirect('/images')
}

export async function removeImageFromSection(formData: FormData) {
  await requireAdmin()
  const admin = createInsForgeAdminClient()
  const { error } = await admin.database
    .from('section_images')
    .delete()
    .eq('id', requiredValue(formData, 'id'))

  assertNoError(error)
  refreshPublicContent()
  redirect('/images')
}
