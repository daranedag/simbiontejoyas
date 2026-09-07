import type { Metadata } from 'next'
import { getPublicSiteContent, getSiteVisibilityMode } from '../lib/cms'
import '../src/styles.css'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicSiteContent()
  const isUnderConstruction = getSiteVisibilityMode(content.texts) === 'construction'

  return {
    title: isUnderConstruction
      ? 'Simbionte Joyas · Sitio en construcción'
      : content.texts['home.seo.title'] ?? 'Simbionte Joyas',
    description:
      isUnderConstruction
        ? 'Estamos preparando el nuevo sitio de Simbionte Joyas.'
        : content.texts['home.seo.description'] ??
          'Joyería de autor hecha a mano en Valdivia, Chile.',
    robots: isUnderConstruction ? { index: false, follow: false } : undefined,
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  )
}
