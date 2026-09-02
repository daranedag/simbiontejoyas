import type { Metadata } from 'next'
import { getPublicSiteContent } from '../lib/cms'
import '../src/styles.css'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicSiteContent()

  return {
    title: content.texts['home.seo.title'] ?? 'Simbionte Joyas',
    description:
      content.texts['home.seo.description'] ??
      'Joyería de autor hecha a mano en Valdivia, Chile.',
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  )
}
