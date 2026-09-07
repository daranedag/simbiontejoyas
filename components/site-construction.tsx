import logo from '../src/assets/simbionte-header-logo-cropped.png'

const instagramUrl = 'https://www.instagram.com/simbiontejoyas/'

export function SiteConstruction() {
  return (
    <main className="construction-page">
      <div aria-hidden="true" className="construction-orbit construction-orbit-large" />
      <div aria-hidden="true" className="construction-orbit construction-orbit-small" />

      <header className="construction-header">
        <img alt="Simbionte, fragmentos de un paraíso" src={logo.src} />
      </header>

      <section className="construction-content" aria-labelledby="construction-title">
        <p className="eyebrow">Joyería de autor · Valdivia, Chile</p>
        <h1 id="construction-title">Sitio en <em>construcción.</em></h1>
        <p>Estamos preparando un nuevo espacio para compartir las piezas, procesos y paisajes que dan vida a Simbionte.</p>
        <a href={instagramUrl} rel="noreferrer" target="_blank">
          Mientras tanto, encuéntranos en Instagram <span>↗</span>
        </a>
      </section>

      <footer className="construction-footer">
        <span>© {new Date().getFullYear()} Simbionte Joyas</span>
        <span>Hecho a mano desde el sur de Chile</span>
      </footer>
    </main>
  )
}
