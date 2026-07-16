import { useEffect, useState } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { portfolio } from './data'

const instagramUrl = 'https://www.instagram.com/simbiontejoyas/'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

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

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Simbionte Joyas, inicio" onClick={closeMenu}>simbionte<span>joyas</span></a>
        <button className="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <i /><i />
        </button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">
          <a href="#obra" onClick={closeMenu}>obra</a>
          <a href="#proceso" onClick={closeMenu}>proceso</a>
          <a href="#contacto" onClick={closeMenu}>contacto</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Joyería de autor · hecha a mano</p>
            <h1 id="hero-title">Formas que<br /><em>encuentran</em> cuerpo.</h1>
            <a className="text-link" href="#obra">Ver la obra <span>↓</span></a>
          </div>
          <div className="hero-art" aria-label="Espacio reservado para fotografía destacada de una joya">
            <div className="hero-ring" />
            <span>imagen de obra<br />por incorporar</span>
          </div>
        </section>

        <section className="portfolio-section" id="obra" aria-labelledby="portfolio-title">
          <div className="section-heading">
            <p className="eyebrow">Selección</p>
            <h2 id="portfolio-title">Obra reciente</h2>
            <p>Una muestra de piezas y exploraciones. Las fotografías finales serán administradas desde el próximo catálogo.</p>
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

        <section className="about" id="proceso" aria-labelledby="process-title">
          <div className="about-marker">↗</div>
          <div className="about-copy">
            <p className="eyebrow">El hacer</p>
            <h2 id="process-title">Cada pieza empieza<br />por una conversación<br />con la materia.</h2>
          </div>
          <div className="about-text">
            <p>Metales, texturas y volúmenes se transforman lentamente en piezas para habitar el cuerpo. Esta sección reunirá la historia, los materiales y las técnicas que dan vida a cada creación.</p>
            <p className="placeholder-note">Texto de presentación pendiente de edición.</p>
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
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </>
  )
}

export default App
