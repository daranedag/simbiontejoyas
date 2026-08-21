'use client'

import { useEffect, useState } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { aboutSlides, heroImage, portfolio, processCards } from './data'
import valdiviaFlag from './assets/valdivia-flag.svg'
import headerIsotype from './assets/simbionte-header-isotype.png'
import headerLogotype from './assets/simbionte-header-logotype.png'

const instagramUrl = 'https://www.instagram.com/simbiontejoyas/'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [processSlide, setProcessSlide] = useState(0)

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#portfolio-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
      showHideAnimationType: 'zoom',
      bgOpacity: 0.95,
    })
    lightbox.init()
    return () => lightbox.destroy()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const previousSlide = () => setSlide((current) => (current - 1 + aboutSlides.length) % aboutSlides.length)
  const nextSlide = () => setSlide((current) => (current + 1) % aboutSlides.length)
  const activeSlide = aboutSlides[slide]
  const previousProcessSlide = () => setProcessSlide((current) => (current - 1 + processCards.length) % processCards.length)
  const nextProcessSlide = () => setProcessSlide((current) => (current + 1) % processCards.length)
  const activeProcessCard = processCards[processSlide]

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Simbionte, inicio" onClick={closeMenu}>
          <img className="brand-isotype" src={headerIsotype.src} alt="" />
          <img className="brand-logotype" src={headerLogotype.src} alt="Simbionte, fragmentos de un paraíso" />
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <i /><i />
        </button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">
          <a href="#obra" onClick={closeMenu}>obra</a>
          <a href="#sobre-mi" onClick={closeMenu}>sobre mí</a>
          <a href="#proceso" onClick={closeMenu}>proceso</a>
          <a href="#contacto" onClick={closeMenu}>contacto</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <img className="hero-image" src={heroImage} alt="Textura natural de líquenes anaranjados" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow">Joyería de autor · hecha a mano</p>
            <h1 id="hero-title">Fragmentos de un<br /><em>paraíso.</em></h1>
            <p className="hero-description">Piezas nacidas de la observación íntima del bosque valdiviano.</p>
            <a className="text-link text-link-light" href="#obra">Explorar la obra <span>↓</span></a>
          </div>
          <p className="hero-caption">Valdivia, Chile<br />Materia · memoria · forma</p>
        </section>

        <section className="portfolio-section" id="obra" aria-labelledby="portfolio-title">
          <div className="section-heading">
            <p className="eyebrow">Obra</p>
            <h2 id="portfolio-title">Pequeños <em>paisajes</em>, <em>texturas orgánicas</em> y <em>metales</em> que se encuentran para habitar el <em>cuerpo</em>.</h2>
          </div>
          <div className="portfolio-grid" id="portfolio-gallery">
            {portfolio.map((item) => (
              <a className="portfolio-item" href={item.image} data-pswp-width={item.width} data-pswp-height={item.height} key={item.id}>
                <img src={item.image} alt={item.alt} />
                <span className="item-number">{item.id}</span>
                <span className="item-title">{item.title}</span>
              </a>
            ))}
          </div>
          <p className="gallery-hint">Selecciona una imagen para verla en detalle.</p>
        </section>

        <section className="about-me" id="sobre-mi" aria-labelledby="about-title">
          <div className="about-intro">
            <p className="eyebrow">Sobre mí</p>
            <h2 id="about-title">Soy <em>Claudia Lagos</em>,<br />creadora de Simbionte Joyas.</h2>
            <p>Vivo y creo en Valdivia, en la Región de Los Ríos, donde el bosque húmedo y la lluvia mantienen el paisaje en permanente transformación. Desde este territorio nacen las formas, materiales y memorias que dan vida a Simbionte.</p>
          </div>
          <div className="about-carousel" aria-roledescription="carrusel" aria-label="Imágenes que inspiran Simbionte">
            <div className="carousel-frame">
              <img key={activeSlide.image} src={activeSlide.image} alt={activeSlide.alt} />
            </div>
            <div className="carousel-controls">
              <div className="carousel-dots" aria-label="Seleccionar imagen">
                {aboutSlides.map((item, index) => (
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

        <section className="process" id="proceso" aria-labelledby="process-title">
          <div className="process-heading">
            <p className="eyebrow">Proceso</p>
            <h2 id="process-title">Del <em>paisaje</em> al <em>cuerpo</em>, cada pieza encuentra su <em>forma</em>.</h2>
          </div>
          <div className="process-carousel" aria-roledescription="carrusel" aria-label="Ideas detrás del proceso de Simbionte">
            <article className="process-card" key={activeProcessCard.title}>
              <img src={activeProcessCard.image} alt="" aria-hidden="true" />
              <div className="process-card-shade" />
              <div className="process-card-content">
                <span>{String(processSlide + 1).padStart(2, '0')} / {String(processCards.length).padStart(2, '0')}</span>
                <h3>{activeProcessCard.title}</h3>
                <p>{activeProcessCard.content}</p>
              </div>
            </article>
            <div className="process-controls">
              <div className="process-dots" aria-label="Seleccionar tarjeta">
                {processCards.map((card, index) => (
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

        <section className="contact" id="contacto" aria-labelledby="contact-title">
          <p className="eyebrow">Piezas, encargos y novedades</p>
          <h2 id="contact-title">Hablemos.</h2>
          <a className="instagram-link" href={instagramUrl} target="_blank" rel="noreferrer">@simbiontejoyas <span>↗</span></a>
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Simbionte Joyas</span>
        <span className="footer-credit">De Valdivia <img src={valdiviaFlag.src} alt="Bandera de Valdivia" /> con <span aria-label="amor" role="img">❤️</span> por <a href="https://diegui.dev" target="_blank" rel="noreferrer">diegui.dev</a></span>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </>
  )
}

export default App
