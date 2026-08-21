import heroImage from '../inspiracion/Fotitos Clau-4.jpg'
import brandSymbol from '../src/assets/simbionte-symbol-2177cp.png'
import brandWordmark from '../src/assets/simbionte-wordmark.png'

export default function HomePage() {
  return (
    <main className="coming-soon">
      <div className="coming-soon-image" aria-hidden="true">
        <img src={heroImage.src} alt="" />
      </div>
      <div className="coming-soon-shade" aria-hidden="true" />

      <header className="coming-soon-header">
        <a className="coming-soon-brand" href="/" aria-label="Simbionte Joyas">
          <img className="coming-soon-symbol" src={brandSymbol.src} alt="" />
          <img className="coming-soon-wordmark" src={brandWordmark.src} alt="" />
        </a>
        <p>Valdivia, Chile</p>
      </header>

      <section className="coming-soon-content" aria-labelledby="coming-soon-title">
        <p className="eyebrow">Joyería de autor · hecha a mano</p>
        <h1 id="coming-soon-title">Sitio en<br /><em>construcción.</em></h1>
        <p className="coming-soon-copy">Pronto habrá novedades, piezas y pequeños fragmentos del bosque para habitar el cuerpo.</p>
        <a className="coming-soon-link" href="https://www.instagram.com/simbiontejoyas/" target="_blank" rel="noreferrer">
          Síguenos en Instagram <span>↗</span>
        </a>
      </section>

      <footer className="coming-soon-footer">Materia · memoria · forma</footer>
    </main>
  )
}
