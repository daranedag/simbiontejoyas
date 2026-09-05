'use client'

import { useEffect, useState } from 'react'
import App from '../src/App'
import type { PublicSiteContent, SectionImage } from '../lib/cms'

type PreviewMessage = {
  type: 'simbionte-preview:update'
  texts: Record<string, string>
  sectionImages: SectionImage[]
  activeSection: string
}

const previewTargets: Record<string, string> = {
  navigation: 'inicio',
  hero: 'inicio',
  work: 'obra',
  about: 'sobre-mi',
  process: 'proceso',
  contact: 'contacto',
  footer: 'site-footer',
}

function isPreviewMessage(value: unknown): value is PreviewMessage {
  if (!value || typeof value !== 'object') return false
  const message = value as Partial<PreviewMessage>
  return message.type === 'simbionte-preview:update'
    && Boolean(message.texts)
    && Array.isArray(message.sectionImages)
    && typeof message.activeSection === 'string'
}

export function AdminPreviewCanvas({ initialContent }: { initialContent: PublicSiteContent }) {
  const [content, setContent] = useState(initialContent)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    function receivePreview(event: MessageEvent<unknown>) {
      if (event.origin !== window.location.origin || event.source !== window.parent || !isPreviewMessage(event.data)) {
        return
      }

      const message = event.data
      setContent((current) => ({
        ...current,
        texts: message.texts,
        sectionImages: message.sectionImages,
      }))
      setActiveSection(message.activeSection)
    }

    window.addEventListener('message', receivePreview)
    window.parent.postMessage({ type: 'simbionte-preview:ready' }, window.location.origin)
    return () => window.removeEventListener('message', receivePreview)
  }, [])

  useEffect(() => {
    const targetId = previewTargets[activeSection]
    if (!targetId) return

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId)
      if (!target) return
      const top = target.getBoundingClientRect().top + window.scrollY - 48
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [activeSection])

  return (
    <div className="admin-preview-mode">
      <div className="admin-preview-banner" role="status">
        Vista previa privada · los cambios todavía no son públicos
      </div>
      <App content={content} previewSection={activeSection} />
    </div>
  )
}
