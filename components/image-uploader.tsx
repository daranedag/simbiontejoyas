'use client'

import { useRef, useState } from 'react'

type UploadAuth = {
  token: string
  expire: number
  signature: string
  publicKey: string
  folder: string
}

type ImageKitUpload = {
  fileId: string
  filePath?: string
  name?: string
  url: string
  thumbnailUrl?: string
  fileType?: string
  width?: number
  height?: number
  size?: number
}

export function ImageUploader() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, setState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const file = form.get('file')

    if (!(file instanceof File) || file.size === 0) {
      setState('error')
      setMessage('Elige una fotografía antes de subirla.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setState('error')
      setMessage('Solo se permiten archivos de imagen.')
      return
    }

    setState('uploading')
    setMessage('Subiendo fotografía a ImageKit…')

    try {
      const authResponse = await fetch('/api/admin/imagekit-auth', { cache: 'no-store' })
      const auth = (await authResponse.json()) as UploadAuth & { message?: string }
      if (!authResponse.ok) throw new Error(auth.message || 'No se pudo autorizar la carga.')

      const imageKitForm = new FormData()
      imageKitForm.append('file', file)
      imageKitForm.append('fileName', file.name)
      imageKitForm.append('token', auth.token)
      imageKitForm.append('expire', String(auth.expire))
      imageKitForm.append('signature', auth.signature)
      imageKitForm.append('publicKey', auth.publicKey)
      imageKitForm.append('folder', auth.folder)
      imageKitForm.append('useUniqueFileName', 'true')

      const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: imageKitForm,
      })
      const uploaded = (await uploadResponse.json()) as ImageKitUpload & { message?: string }
      if (!uploadResponse.ok || !uploaded.fileId) {
        throw new Error(uploaded.message || 'ImageKit no pudo cargar la fotografía.')
      }

      const recordResponse = await fetch('/api/admin/images', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          providerFileId: uploaded.fileId,
          providerFilePath: uploaded.filePath,
          fileName: uploaded.name || file.name,
          url: uploaded.url,
          thumbnailUrl: uploaded.thumbnailUrl,
          mimeType: uploaded.fileType || file.type,
          width: uploaded.width,
          height: uploaded.height,
          fileSizeBytes: uploaded.size || file.size,
          title: form.get('title'),
          altText: form.get('alt_text'),
          caption: form.get('caption'),
        }),
      })
      const record = (await recordResponse.json()) as { message?: string }
      if (!recordResponse.ok) throw new Error(record.message || 'No se pudo guardar la fotografía.')

      setState('success')
      setMessage('Fotografía guardada como borrador. Actualizando la biblioteca…')
      formRef.current?.reset()
      window.setTimeout(() => window.location.reload(), 600)
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Ocurrió un error al subir la fotografía.')
    }
  }

  return (
    <form className="admin-upload-form" onSubmit={upload} ref={formRef}>
      <label className="admin-file-input">Fotografía<input accept="image/*" name="file" required type="file" /></label>
      <label>Título<input name="title" placeholder="Ej. Anillo liquen" /></label>
      <label>Texto alternativo<input name="alt_text" placeholder="Describe la imagen para accesibilidad" /></label>
      <label className="admin-field-wide">Pie de foto<textarea name="caption" rows={2} /></label>
      <button className="admin-button" disabled={state === 'uploading'} type="submit">
        {state === 'uploading' ? 'Subiendo…' : 'Subir a ImageKit'}
      </button>
      {state !== 'idle' && <p aria-live="polite" className={`admin-upload-message is-${state}`}>{message}</p>}
    </form>
  )
}
