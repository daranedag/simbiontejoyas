'use client'

import Link from 'next/link'
import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { savePageSection, type SavePageSectionState } from '../app/admin/actions'
import type { CmsImage, PageText, SectionImage } from '../lib/cms'

export type AdminImageOption = CmsImage & {
  file_name: string
  status: 'draft' | 'published' | 'archived'
}

type ImageSlot = {
  label: string
  position: number
  section: string
  slot: string
}

type SectionDefinition = {
  description: string
  imageSlots?: ImageSlot[]
  key: string
  label: string
}

const sectionDefinitions: SectionDefinition[] = [
  {
    key: 'hero',
    label: 'Portada',
    description: 'El primer bloque que ven las personas al entrar al sitio.',
    imageSlots: [{ label: 'Imagen de fondo', section: 'hero', slot: 'background', position: 0 }],
  },
  {
    key: 'work',
    label: 'Obra',
    description: 'Título y texto que acompañan la galería principal.',
  },
  {
    key: 'about',
    label: 'Sobre mí',
    description: 'Presentación de Claudia y fotografías del carrusel.',
    imageSlots: Array.from({ length: 3 }, (_, position) => ({
      label: `Fotografía ${position + 1} del carrusel`,
      section: 'about',
      slot: 'gallery',
      position,
    })),
  },
  {
    key: 'process',
    label: 'Proceso',
    description: 'Relato del proceso creativo, sus tarjetas y fotografías.',
    imageSlots: Array.from({ length: 6 }, (_, position) => ({
      label: `Fotografía de la tarjeta ${position + 1}`,
      section: 'process',
      slot: 'card',
      position,
    })),
  },
  {
    key: 'contact',
    label: 'Contacto',
    description: 'Invitación final y acceso a Instagram.',
  },
  {
    key: 'navigation',
    label: 'Menú',
    description: 'Nombres de las secciones en la parte superior del sitio.',
  },
  {
    key: 'footer',
    label: 'Pie de página',
    description: 'Información que aparece al final de la página.',
  },
  {
    key: 'seo',
    label: 'Buscadores',
    description: 'Título y descripción usados por buscadores y al compartir el sitio.',
  },
]

const initialSaveState: SavePageSectionState = { status: 'idle', message: '' }

const targetKey = (slot: ImageSlot) => `${slot.section}|${slot.slot}|${slot.position}`
const relationKey = (relation: SectionImage) => `${relation.section_key}|${relation.slot_key}|${relation.position}`

function editableLabel(item: PageText) {
  const parts = item.admin_label.split('·').map((part) => part.trim())
  return parts.length > 1 ? parts.slice(1).join(' · ') : item.admin_label
}

function initialTextValues(items: PageText[]) {
  return Object.fromEntries(items.map((item) => [item.id, item.content]))
}

function initialImageValues(relations: SectionImage[]) {
  const relationMap = new Map(relations.map((relation) => [relationKey(relation), relation.image_id]))
  return Object.fromEntries(
    sectionDefinitions.flatMap((section) => section.imageSlots ?? []).map((slot) => [targetKey(slot), relationMap.get(targetKey(slot)) ?? '']),
  )
}

function previewSectionImages(
  originalRelations: SectionImage[],
  imageValues: Record<string, string>,
  images: AdminImageOption[],
) {
  const managedTargets = new Set(sectionDefinitions.flatMap((section) => section.imageSlots ?? []).map(targetKey))
  const untouchedRelations = originalRelations.filter((relation) => !managedTargets.has(relationKey(relation)))
  const imageMap = new Map(images.map((image) => [image.id, image]))
  const selectedRelations = Object.entries(imageValues).flatMap(([target, imageId]) => {
    const image = imageMap.get(imageId)
    if (!image) return []

    const [sectionKey, slotKey, positionValue] = target.split('|')
    return [{
      id: `preview-${target}`,
      page_key: 'home',
      section_key: sectionKey,
      slot_key: slotKey,
      position: Number.parseInt(positionValue, 10),
      image_id: image.id,
      images: image,
    } satisfies SectionImage]
  })

  return [...untouchedRelations, ...selectedRelations]
}

function PreviewFrame({
  activeSection,
  previewPath,
  sectionImages,
  texts,
}: {
  activeSection: string
  previewPath: string
  sectionImages: SectionImage[]
  texts: Record<string, string>
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [ready, setReady] = useState(false)
  const [scale, setScale] = useState(0.6)
  const size = device === 'desktop' ? { width: 1280, height: 820 } : { width: 390, height: 820 }

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = Math.max(280, entry.contentRect.width - 2)
      setScale(Math.min(1, availableWidth / size.width))
    })

    observer.observe(shell)
    return () => observer.disconnect()
  }, [size.width])

  useEffect(() => {
    function receiveReady(event: MessageEvent<unknown>) {
      if (
        event.origin === window.location.origin
        && event.source === iframeRef.current?.contentWindow
        && typeof event.data === 'object'
        && event.data
        && (event.data as { type?: string }).type === 'simbionte-preview:ready'
      ) {
        setReady(true)
      }
    }

    window.addEventListener('message', receiveReady)
    return () => window.removeEventListener('message', receiveReady)
  }, [])

  useEffect(() => {
    if (!ready) return
    iframeRef.current?.contentWindow?.postMessage({
      type: 'simbionte-preview:update',
      texts,
      sectionImages,
      activeSection,
    }, window.location.origin)
  }, [activeSection, ready, sectionImages, texts])

  return (
    <section className="admin-preview-panel" aria-label="Vista previa del sitio">
      <div className="admin-preview-toolbar">
        <div>
          <strong>Vista previa</strong>
          <span>Se actualiza mientras escribes</span>
        </div>
        <div className="admin-preview-devices" aria-label="Tamaño de la vista previa">
          <button aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')} type="button">Escritorio</button>
          <button aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')} type="button">Móvil</button>
        </div>
      </div>
      <div className="admin-search-preview" hidden={activeSection !== 'seo'}>
        <span>simbiontejoyas.cl</span>
        <strong>{texts['home.seo.title'] || 'Simbionte Joyas'}</strong>
        <p>{texts['home.seo.description'] || 'Descripción del sitio para buscadores.'}</p>
        <small>Ejemplo aproximado de cómo puede aparecer el sitio en un buscador.</small>
      </div>
      <div className="admin-preview-frame-shell" hidden={activeSection === 'seo'} ref={shellRef}>
        <div
          className="admin-preview-frame-stage"
          style={{ height: size.height * scale, width: size.width * scale }}
        >
          <iframe
            className="admin-preview-frame"
            onLoad={() => setReady(true)}
            ref={iframeRef}
            sandbox="allow-same-origin allow-scripts"
            src={previewPath}
            style={{ height: size.height, transform: `scale(${scale})`, width: size.width }}
            title="Vista previa privada del sitio"
          />
        </div>
      </div>
    </section>
  )
}

export function AdminSectionEditor({
  collectionsPath,
  imageLibraryPath,
  images,
  items,
  previewPath,
  sectionImages,
}: {
  collectionsPath: string
  imageLibraryPath: string
  images: AdminImageOption[]
  items: PageText[]
  previewPath: string
  sectionImages: SectionImage[]
}) {
  const availableSections = sectionDefinitions.filter((section) => items.some((item) => item.section_key === section.key))
  const [activeKey, setActiveKey] = useState(availableSections[0]?.key ?? 'hero')
  const [textValues, setTextValues] = useState(() => initialTextValues(items))
  const [textBaseline, setTextBaseline] = useState(() => initialTextValues(items))
  const [imageValues, setImageValues] = useState(() => initialImageValues(sectionImages))
  const [imageBaseline, setImageBaseline] = useState(() => initialImageValues(sectionImages))
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit')
  const [publishedSections, setPublishedSections] = useState<string[]>([])
  const [saveState, formAction, pending] = useActionState(savePageSection, initialSaveState)

  const activeSection = availableSections.find((section) => section.key === activeKey) ?? availableSections[0]
  const activeItems = items.filter((item) => item.section_key === activeSection?.key)
  const activeImageSlots = activeSection?.imageSlots ?? []

  function sectionHasChanges(section: SectionDefinition) {
    return items.some((item) => item.section_key === section.key && textValues[item.id] !== textBaseline[item.id])
      || (section.imageSlots ?? []).some((slot) => imageValues[targetKey(slot)] !== imageBaseline[targetKey(slot)])
  }

  const isDirty = activeSection ? sectionHasChanges(activeSection) : false
  const hasUnsavedChanges = availableSections.some(sectionHasChanges)

  const previewTexts = useMemo(
    () => Object.fromEntries(items.map((item) => [item.content_key, textValues[item.id] ?? item.content])),
    [items, textValues],
  )
  const previewImages = useMemo(
    () => previewSectionImages(sectionImages, imageValues, images),
    [imageValues, images, sectionImages],
  )

  useEffect(() => {
    if (saveState.status !== 'success' || !saveState.sectionKey) return
    const savedSectionKey = saveState.sectionKey
    setTextBaseline((current) => ({ ...current, ...saveState.contents }))
    setImageBaseline((current) => ({ ...current, ...saveState.images }))
    setPublishedSections((current) => current.includes(savedSectionKey) ? current : [...current, savedSectionKey])
  }, [saveState])

  useEffect(() => {
    if (!hasUnsavedChanges) return

    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [hasUnsavedChanges])

  if (!activeSection) {
    return <p className="admin-empty">No hay secciones configuradas todavía.</p>
  }

  function discardSectionChanges() {
    setTextValues((current) => {
      const next = { ...current }
      activeItems.forEach((item) => { next[item.id] = textBaseline[item.id] })
      return next
    })
    setImageValues((current) => {
      const next = { ...current }
      activeImageSlots.forEach((slot) => { next[targetKey(slot)] = imageBaseline[targetKey(slot)] })
      return next
    })
  }

  return (
    <div className="admin-visual-editor">
      <nav className="admin-section-tabs" aria-label="Secciones de la página">
        {availableSections.map((section) => {
          const sectionItems = items.filter((item) => item.section_key === section.key)
          const published = publishedSections.includes(section.key) || sectionItems.every((item) => item.status === 'published')
          const dirty = sectionHasChanges(section)
          return (
            <button
              aria-current={section.key === activeSection.key ? 'page' : undefined}
              data-dirty={dirty || undefined}
              disabled={pending}
              key={section.key}
              onClick={() => {
                setActiveKey(section.key)
                setMobilePane('edit')
              }}
              type="button"
            >
              <span>{section.label}</span>
              <small>{dirty ? 'Cambios sin publicar' : published ? 'Publicada' : 'En borrador'}</small>
            </button>
          )
        })}
      </nav>

      <div className="admin-mobile-editor-switch" aria-label="Cambiar entre edición y vista previa">
        <button aria-pressed={mobilePane === 'edit'} onClick={() => setMobilePane('edit')} type="button">Editar</button>
        <button aria-pressed={mobilePane === 'preview'} onClick={() => setMobilePane('preview')} type="button">Vista previa</button>
      </div>

      <div className="admin-section-editor-layout" data-mobile-pane={mobilePane}>
        <section className="admin-card admin-section-form-card">
          <div className="admin-section-form-heading">
            <div>
              <p className="admin-kicker">Editar sección</p>
              <h2>{activeSection.label}</h2>
              <p>{activeSection.description}</p>
            </div>
            <span className={isDirty ? 'admin-unsaved is-dirty' : 'admin-unsaved'}>
              {isDirty ? 'Cambios sin publicar' : 'Todo publicado'}
            </span>
          </div>

          <form action={formAction} className="admin-section-form">
            <input name="section_key" type="hidden" value={activeSection.key} />
            {activeItems.map((item) => (
              <div className="admin-section-field" key={item.id}>
                <input name="item_id" type="hidden" value={item.id} />
                <input name={`format:${item.id}`} type="hidden" value={item.content_format} />
                <label htmlFor={`content-${item.id}`}>{editableLabel(item)}</label>
                <textarea
                  id={`content-${item.id}`}
                  name={`content:${item.id}`}
                  onChange={(event) => setTextValues((current) => ({ ...current, [item.id]: event.target.value }))}
                  required
                  rows={item.content.length > 140 ? 5 : item.content.includes('\n') ? 4 : 3}
                  value={textValues[item.id] ?? ''}
                />
                {item.content_format === 'markdown' && (
                  <small>Usa *asteriscos* para destacar palabras. Los saltos de línea se verán en la vista previa.</small>
                )}
              </div>
            ))}

            {activeImageSlots.length > 0 && (
              <div className="admin-section-image-fields">
                <div className="admin-section-subheading">
                  <div><h3>Fotografías</h3><p>Escoge una imagen y comprueba el encuadre antes de publicar.</p></div>
                  <Link href={imageLibraryPath}>Abrir biblioteca</Link>
                </div>
                {activeImageSlots.map((slot) => {
                  const target = targetKey(slot)
                  const selectedImage = images.find((image) => image.id === imageValues[target])
                  return (
                    <div className="admin-section-image-field" key={target}>
                      <input name="image_target" type="hidden" value={target} />
                      <div className="admin-section-image-thumb">
                        {selectedImage
                          ? <img alt={selectedImage.alt_text || ''} src={selectedImage.thumbnail_url || selectedImage.url} />
                          : <span>Foto original</span>}
                      </div>
                      <label htmlFor={`image-${target}`}>
                        {slot.label}
                        <select
                          id={`image-${target}`}
                          name={`image:${target}`}
                          onChange={(event) => setImageValues((current) => ({ ...current, [target]: event.target.value }))}
                          value={imageValues[target] ?? ''}
                        >
                          <option value="">Usar la fotografía original del sitio</option>
                          {images.filter((image) => image.status !== 'archived').map((image) => (
                            <option key={image.id} value={image.id}>
                              {image.title || image.file_name}{image.status === 'draft' ? ' · borrador' : ''}
                            </option>
                          ))}
                        </select>
                        <small>La fotografía elegida se publicará junto con esta sección.</small>
                      </label>
                    </div>
                  )
                })}
              </div>
            )}

            {activeSection.key === 'work' && (
              <div className="admin-context-link">
                <div><strong>Fotografías de Obra</strong><span>La galería se organiza mediante colecciones.</span></div>
                <Link className="admin-button admin-button-secondary" href={collectionsPath}>Administrar galería</Link>
              </div>
            )}

            <div className="admin-section-form-footer">
              <p aria-live="polite" className={`admin-save-message is-${isDirty ? 'idle' : saveState.status}`}>
                {isDirty ? 'Sólo se actualizará el sitio cuando publiques la sección.' : saveState.message || 'No hay cambios pendientes.'}
              </p>
              <div>
                <button className="admin-button admin-button-secondary" disabled={!isDirty || pending} onClick={discardSectionChanges} type="button">
                  Descartar cambios
                </button>
                <button className="admin-button" disabled={!isDirty || pending} type="submit">
                  {pending ? 'Publicando…' : 'Publicar sección'}
                </button>
              </div>
            </div>
          </form>
        </section>

        <PreviewFrame
          activeSection={activeSection.key}
          previewPath={previewPath}
          sectionImages={previewImages}
          texts={previewTexts}
        />
      </div>
    </div>
  )
}
