'use client'

import { Fragment, useEffect, useState } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { aboutSlides, heroImage, portfolio, processCards } from './data'
import valdiviaFlag from './assets/valdivia-flag.svg'
import headerIsotype from './assets/simbionte-header-isotype.png'
import headerLogotype from './assets/simbionte-header-logotype.png'
import type { PublicImageGroup, PublicSiteContent, SectionImage } from '../lib/cms'

const instagramUrl = 'https://www.instagram.com/simbiontejoyas/'
const fallbackCollections = [{
  id: 'obra-seleccionada',
  name: 'Obra seleccionada',
  description: '',
  items: portfolio,
}]

const defaultTexts: Record<string, string> = {
  'home.navigation.work': 'obra',
  'home.navigation.projects': 'proyectos',
  'home.navigation.about': 'sobre mí',
  'home.navigation.process': 'proceso',
  'home.navigation.contact': 'contacto',
  'home.hero.eyebrow': 'Joyería de autor · hecha a mano',
  'home.hero.title': 'Fragmentos de un\\\n*paraíso.*',
  'home.hero.description': 'Piezas nacidas de la observación íntima del bosque valdiviano.',
  'home.hero.cta': 'Explorar la obra',
  'home.hero.caption': 'Valdivia, Chile\\\nMateria · memoria · forma',
  'home.work.eyebrow': 'Obra',
  'home.work.title': 'Pequeños *paisajes*, *texturas orgánicas* y *metales* que se encuentran para habitar el *cuerpo*.',
  'home.work.gallery_hint': 'Selecciona una imagen para verla en detalle.',
  'home.projects.eyebrow': 'Proyectos',
  'home.projects.title': 'Obras que nacen del *encuentro*, la *investigación* y la *colaboración*.',
  'home.projects.empty': 'Nuevos proyectos próximamente.',
  'home.about.eyebrow': 'Sobre mí',
  'home.about.title': 'Soy *Claudia Lagos*,\\\ncreadora de Simbionte Joyas.',
  'home.about.body': 'Vivo y creo en Valdivia, en la Región de Los Ríos, donde el bosque húmedo y la lluvia mantienen el paisaje en permanente transformación. Desde este territorio nacen las formas, materiales y memorias que dan vida a Simbionte.',
  'home.process.eyebrow': 'Proceso',
  'home.process.title': 'Del *paisaje* al *cuerpo*, cada pieza encuentra su *forma*.',
  'home.contact.eyebrow': 'Piezas, encargos y novedades',
  'home.contact.title': 'Hablemos.',
  'home.contact.instagram-label': '@simbiontejoyas',
  'home.footer.copyright-name': 'Simbionte Joyas',
  'home.footer.origin': 'De Valdivia',
  'home.footer.credit': 'por diegui.dev',
  'home.footer.back-to-top': 'Volver arriba',
}

function sectionImageUrl(sectionImages: SectionImage[], sectionKey: string, slotKey: string, position = 0) {
  const association = sectionImages.find(
    (item) => item.section_key === sectionKey && item.slot_key === slotKey && item.position === position,
  )
  const image = Array.isArray(association?.images) ? association?.images[0] : association?.images
  return image ? { url: image.url, alt: image.alt_text || image.title || '' } : null
}

function formatEditorialText(text: string) {
  const lines = text.replace(/\\\r?\n/g, '\n').split(/\r?\n/)

  return lines.map((line, lineIndex) => (
    <Fragment key={`${line}-${lineIndex}`}>
      {line.split(/(\*[^*]+\*)/g).map((part, partIndex) =>
        part.startsWith('*') && part.endsWith('*')
          ? <em key={`${part}-${partIndex}`}>{part.slice(1, -1)}</em>
          : <Fragment key={`${part}-${partIndex}`}>{part}</Fragment>,
      )}
      {lineIndex < lines.length - 1 && <br />}
    </Fragment>
  ))
}

function ImageGroupAccordion({
  activeId,
  emptyMessage,
  galleryHint,
  galleryId,
  groups,
  idPrefix,
  onToggle,
}: {
  activeId: string | null
  emptyMessage: string
  galleryHint: string
  galleryId: string
  groups: PublicImageGroup[]
  idPrefix: 'collection' | 'project'
  onToggle: (id: string) => void
}) {
  return (
    <div className="image-group-accordion">
      {groups.map((group, index) => {
        const expanded = group.id === activeId
        const accessibleId = group.id.replace(/[^a-zA-Z0-9_-]/g, '-')
        const headingId = `${idPrefix}-${accessibleId}-heading`
        const panelId = `${idPrefix}-${accessibleId}-panel`

        return (
          <article className={`image-group${expanded ? ' is-expanded' : ''}`} key={group.id}>
            <h3 id={headingId}>
              <button
                aria-controls={panelId}
                aria-expanded={expanded}
                className="image-group-toggle"
                onClick={() => onToggle(group.id)}
                type="button"
              >
                <span className="image-group-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="image-group-name">{group.name}</span>
                <span className="image-group-count">
                  {group.items.length} {group.items.length === 1 ? 'fotografía' : 'fotografías'}
                </span>
                <span aria-hidden="true" className="image-group-icon">{expanded ? '−' : '+'}</span>
              </button>
            </h3>

            {expanded && (
              <div aria-labelledby={headingId} className="image-group-panel" id={panelId} role="region">
                {group.description && <p className="image-group-description">{group.description}</p>}
                {group.items.length > 0 ? (
                  <>
                    <div className="portfolio-grid" id={galleryId}>
                      {group.items.map((item, itemIndex) => (
                        <a className="portfolio-item" href={item.image} data-pswp-width={item.width} data-pswp-height={item.height} key={item.id}>
                          <img src={item.image} alt={item.alt} />
                          <span className="item-number">{String(itemIndex + 1).padStart(2, '0')}</span>
                          <span className="item-title">{item.title}</span>
                        </a>
                      ))}
                    </div>
                    <p className="gallery-hint">{galleryHint}</p>
                  </>
                ) : (
                  <p className="collection-empty">{emptyMessage}</p>
                )}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function App({ content, previewSection }: { content?: PublicSiteContent; previewSection?: string }) {
  const collections = content?.collections ?? fallbackCollections
  const projects = content?.projects ?? []
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(collections[0]?.id ?? null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id ?? null)
  const [slide, setSlide] = useState(0)
  const [processSlide, setProcessSlide] = useState(0)

  const text = (key: string) => content?.texts[key] ?? defaultTexts[key] ?? ''
  const heroSectionImage = sectionImageUrl(content?.sectionImages ?? [], 'hero', 'background')
  const dynamicAboutSlides = (content?.sectionImages ?? [])
    .filter((item) => item.section_key === 'about' && item.slot_key === 'gallery')
    .sort((a, b) => a.position - b.position)
    .map((item) => Array.isArray(item.images) ? item.images[0] : item.images)
    .filter((image): image is NonNullable<typeof image> => Boolean(image))
    .map((image) => ({ image: image.url, alt: image.alt_text || image.title || 'Fotografía de Simbionte Joyas' }))
  const renderedAboutSlides = dynamicAboutSlides.length > 0 ? dynamicAboutSlides : aboutSlides
  const renderedProcessCards = processCards.map((card, index) => {
    const image = sectionImageUrl(content?.sectionImages ?? [], 'process', 'card', index)
    return image ? { ...card, image: image.url, alt: image.alt || card.alt } : card
  })
  const activeCollection = collections.find((collection) => collection.id === activeCollectionId)
  const activeProject = projects.find((project) => project.id === activeProjectId)

  useEffect(() => {
    const lightboxes = ['#portfolio-gallery', '#projects-gallery'].map((gallery) => {
      const lightbox = new PhotoSwipeLightbox({
        gallery,
        children: 'a',
        pswpModule: () => import('photoswipe'),
        showHideAnimationType: 'zoom',
        bgOpacity: 0.95,
      })
      lightbox.init()
      return lightbox
    })

    return () => lightboxes.forEach((lightbox) => lightbox.destroy())
  }, [activeCollection?.id, activeProject?.id])

  const closeMenu = () => setMenuOpen(false)
  const previousSlide = () => setSlide((current) => (current - 1 + renderedAboutSlides.length) % renderedAboutSlides.length)
  const nextSlide = () => setSlide((current) => (current + 1) % renderedAboutSlides.length)
  const activeSlide = renderedAboutSlides[slide % renderedAboutSlides.length]
  const previousProcessSlide = () => setProcessSlide((current) => (current - 1 + renderedProcessCards.length) % renderedProcessCards.length)
  const nextProcessSlide = () => setProcessSlide((current) => (current + 1) % renderedProcessCards.length)
  const activeProcessCard = renderedProcessCards[processSlide % renderedProcessCards.length]

  return (
    <>
      <header className={`site-header${previewSection === 'navigation' ? ' is-admin-preview-active' : ''}`}>
        <a className="brand" href="#inicio" aria-label="Simbionte, inicio" onClick={closeMenu}>
          <img className="brand-isotype" src={headerIsotype.src} alt="" />
          <img className="brand-logotype" src={headerLogotype.src} alt="Simbionte, fragmentos de un paraíso" />
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <i /><i />
        </button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">
          <a href="#obra" onClick={closeMenu}>{text('home.navigation.work')}</a>
          <a href="#proyectos" onClick={closeMenu}>{text('home.navigation.projects')}</a>
          <a href="#sobre-mi" onClick={closeMenu}>{text('home.navigation.about')}</a>
          <a href="#proceso" onClick={closeMenu}>{text('home.navigation.process')}</a>
          <a href="#contacto" onClick={closeMenu}>{text('home.navigation.contact')}</a>
        </nav>
      </header>

      <main>
        <section className={`hero${previewSection === 'hero' ? ' is-admin-preview-active' : ''}`} id="inicio" aria-labelledby="hero-title">
          <img className="hero-image" src={heroSectionImage?.url || heroImage} alt={heroSectionImage?.alt || 'Textura natural de líquenes anaranjados'} />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow">{text('home.hero.eyebrow')}</p>
            <h1 id="hero-title">{formatEditorialText(text('home.hero.title'))}</h1>
            <p className="hero-description">{text('home.hero.description')}</p>
            <a className="text-link text-link-light" href="#obra">{text('home.hero.cta')} <span>↓</span></a>
          </div>
          <p className="hero-caption">{formatEditorialText(text('home.hero.caption'))}</p>
        </section>

        <section className={`portfolio-section${previewSection === 'work' ? ' is-admin-preview-active' : ''}`} id="obra" aria-labelledby="portfolio-title">
          <div className="section-heading">
            <p className="eyebrow">{text('home.work.eyebrow')}</p>
            <h2 id="portfolio-title">{formatEditorialText(text('home.work.title'))}</h2>
          </div>
          {collections.length > 0 ? (
            <ImageGroupAccordion
              activeId={activeCollectionId}
              emptyMessage="Esta colección todavía no tiene fotografías disponibles."
              galleryHint={text('home.work.gallery_hint')}
              galleryId="portfolio-gallery"
              groups={collections}
              idPrefix="collection"
              onToggle={(id) => setActiveCollectionId((current) => current === id ? null : id)}
            />
          ) : (
            <p className="collection-empty">No hay colecciones publicadas en este momento.</p>
          )}
        </section>

        <section className={`projects-section${previewSection === 'projects' ? ' is-admin-preview-active' : ''}`} id="proyectos" aria-labelledby="projects-title">
          <div className="section-heading">
            <p className="eyebrow">{text('home.projects.eyebrow')}</p>
            <h2 id="projects-title">{formatEditorialText(text('home.projects.title'))}</h2>
          </div>
          {projects.length > 0 ? (
            <ImageGroupAccordion
              activeId={activeProjectId}
              emptyMessage="Este proyecto todavía no tiene fotografías disponibles."
              galleryHint={text('home.work.gallery_hint')}
              galleryId="projects-gallery"
              groups={projects}
              idPrefix="project"
              onToggle={(id) => setActiveProjectId((current) => current === id ? null : id)}
            />
          ) : (
            <p className="collection-empty">{text('home.projects.empty')}</p>
          )}
        </section>

        <section className={`about-me${previewSection === 'about' ? ' is-admin-preview-active' : ''}`} id="sobre-mi" aria-labelledby="about-title">
          <div className="about-intro">
            <p className="eyebrow">{text('home.about.eyebrow')}</p>
            <h2 id="about-title">{formatEditorialText(text('home.about.title'))}</h2>
            <p>{text('home.about.body')}</p>
          </div>
          <div className="about-carousel" aria-roledescription="carrusel" aria-label="Imágenes que inspiran Simbionte">
            <div className="carousel-frame">
              <img key={activeSlide.image} src={activeSlide.image} alt={activeSlide.alt} />
            </div>
            <div className="carousel-controls">
              <div className="carousel-dots" aria-label="Seleccionar imagen">
                {renderedAboutSlides.map((item, index) => (
                  <button key={item.image} className={index === slide ? 'is-active' : ''} type="button" aria-label={`Ver imagen ${index + 1}`} aria-pressed={index === slide} onClick={() => setSlide(index)} />
                ))}
              </div>
              <div className="carousel-arrows">
                <button type="button" onClick={previousSlide} aria-label="Imagen anterior">←</button>
                <button type="button" onClick={nextSlide} aria-label="Siguiente imagen">→</button>
              </div>
            </div>
          </div>
        </section>

        <section className={`process${previewSection === 'process' ? ' is-admin-preview-active' : ''}`} id="proceso" aria-labelledby="process-title">
          <div className="process-heading">
            <p className="eyebrow">{text('home.process.eyebrow')}</p>
            <h2 id="process-title">{formatEditorialText(text('home.process.title'))}</h2>
          </div>
          <div className="process-carousel" aria-roledescription="carrusel" aria-label="Ideas detrás del proceso de Simbionte">
            <article className="process-card" key={activeProcessCard.title}>
              <img src={activeProcessCard.image} alt="" aria-hidden="true" />
              <div className="process-card-shade" />
              <div className="process-card-content">
                <span>{String(processSlide + 1).padStart(2, '0')} / {String(renderedProcessCards.length).padStart(2, '0')}</span>
                <h3>{text(`home.process.card-${String((processSlide % renderedProcessCards.length) + 1).padStart(2, '0')}-title`) || activeProcessCard.title}</h3>
                <p>{text(`home.process.card-${String((processSlide % renderedProcessCards.length) + 1).padStart(2, '0')}-body`) || activeProcessCard.content}</p>
              </div>
            </article>
            <div className="process-controls">
              <div className="process-dots" aria-label="Seleccionar tarjeta">
                {renderedProcessCards.map((card, index) => (
                  <button key={card.title} className={index === processSlide ? 'is-active' : ''} type="button" aria-label={`Ver tarjeta ${index + 1}: ${card.title}`} aria-pressed={index === processSlide} onClick={() => setProcessSlide(index)} />
                ))}
              </div>
              <div className="process-arrows">
                <button type="button" onClick={previousProcessSlide} aria-label="Tarjeta anterior">←</button>
                <button type="button" onClick={nextProcessSlide} aria-label="Siguiente tarjeta">→</button>
              </div>
            </div>
          </div>
        </section>

        <section className={`contact${previewSection === 'contact' ? ' is-admin-preview-active' : ''}`} id="contacto" aria-labelledby="contact-title">
          <p className="eyebrow">{text('home.contact.eyebrow')}</p>
          <h2 id="contact-title">{formatEditorialText(text('home.contact.title'))}</h2>
          <a className="instagram-link" href={instagramUrl} target="_blank" rel="noreferrer">{text('home.contact.instagram-label')} <span>↗</span></a>
        </section>
      </main>

      <footer className={`site-footer${previewSection === 'footer' ? ' is-admin-preview-active' : ''}`} id="site-footer">
        <span>© {new Date().getFullYear()} {text('home.footer.copyright-name')}</span>
        <span className="footer-credit">{text('home.footer.origin')} <img src={valdiviaFlag.src} alt="Bandera de Valdivia" /> con <span aria-label="amor" role="img">❤️</span> {text('home.footer.credit').replace(/^por\s+/i, '') ? 'por ' : ''}<a href="https://diegui.dev" target="_blank" rel="noreferrer">{text('home.footer.credit').replace(/^por\s+/i, '') || 'diegui.dev'}</a></span>
        <a href="#inicio">{text('home.footer.back-to-top')} ↑</a>
      </footer>
    </>
  )
}

export default App
