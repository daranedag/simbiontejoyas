'use client'

import { useEffect, useState } from 'react'

type Folder = { name: string; path: string }
type LibraryImage = {
  fileId: string
  name: string
  url: string
  thumbnailUrl: string | null
  filePath: string
}

type LibraryResponse = {
  path: string
  folders: Folder[]
  images: LibraryImage[]
  message?: string
}

function parentPath(path: string) {
  if (path === '/') return '/'
  const segments = path.split('/').filter(Boolean)
  segments.pop()
  return segments.length ? `/${segments.join('/')}` : '/'
}

export function ImageKitLibraryPicker() {
  const [path, setPath] = useState('/')
  const [library, setLibrary] = useState<LibraryResponse | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [importingId, setImportingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setState('loading')
    setMessage('')

    fetch(`/api/admin/imagekit-library?path=${encodeURIComponent(path)}`, { cache: 'no-store' })
      .then(async (response) => {
        const data = (await response.json()) as LibraryResponse
        if (!response.ok) throw new Error(data.message || 'No se pudo leer ImageKit.')
        return data
      })
      .then((data) => {
        if (!active) return
        setLibrary(data)
        setState('ready')
      })
      .catch((error) => {
        if (!active) return
        setState('error')
        setMessage(error instanceof Error ? error.message : 'No se pudo leer ImageKit.')
      })

    return () => { active = false }
  }, [path])

  async function importImage(fileId: string) {
    setImportingId(fileId)
    setMessage('Importando fotografía…')

    try {
      const response = await fetch('/api/admin/imagekit-library/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fileId }),
      })
      const result = (await response.json()) as { message?: string; alreadyImported?: boolean }
      if (!response.ok) throw new Error(result.message || 'No se pudo importar la fotografía.')

      setMessage(result.alreadyImported ? 'Esta fotografía ya estaba en la biblioteca.' : 'Fotografía importada como borrador.')
      window.setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo importar la fotografía.')
      setImportingId(null)
    }
  }

  return (
    <div className="admin-imagekit-picker">
      <div className="admin-imagekit-toolbar">
        <div>
          <p className="admin-imagekit-path">{library?.path || path}</p>
          <p>Explora los archivos existentes y agrega los que quieras administrar en el sitio.</p>
        </div>
        <div className="admin-imagekit-actions">
          <button className="admin-button admin-button-secondary" disabled={path === '/' || state === 'loading'} onClick={() => setPath(parentPath(path))} type="button">Volver</button>
          <button className="admin-button admin-button-secondary" disabled={state === 'loading'} onClick={() => setPath('/')} type="button">Raíz</button>
        </div>
      </div>

      {state === 'loading' && <p className="admin-empty">Leyendo biblioteca de ImageKit…</p>}
      {state === 'error' && <p className="admin-upload-message is-error">{message}</p>}

      {state === 'ready' && library && (
        <>
          {library.folders.length > 0 && (
            <div className="admin-imagekit-folders">
              {library.folders.map((folder) => (
                <button className="admin-imagekit-folder" key={folder.path} onClick={() => setPath(folder.path)} type="button">↗ {folder.name}</button>
              ))}
            </div>
          )}

          {library.images.length === 0 ? (
            <p className="admin-empty">No hay imágenes en esta carpeta.</p>
          ) : (
            <div className="admin-imagekit-grid">
              {library.images.map((image) => (
                <article className="admin-imagekit-asset" key={image.fileId}>
                  <img alt="" src={image.thumbnailUrl || image.url} />
                  <div>
                    <strong>{image.name}</strong>
                    {image.filePath && <span>{image.filePath}</span>}
                    <button className="admin-button" disabled={importingId !== null} onClick={() => importImage(image.fileId)} type="button">
                      {importingId === image.fileId ? 'Importando…' : 'Usar esta foto'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {message && state !== 'error' && <p aria-live="polite" className="admin-upload-message is-success">{message}</p>}
    </div>
  )
}
