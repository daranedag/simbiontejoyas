import type { Metadata } from 'next'
import '../src/styles.css'

export const metadata: Metadata = {
  title: 'Simbionte Joyas — Próximamente',
  description: 'Simbionte Joyas: fragmentos de un paraíso. Próximamente novedades.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  )
}
