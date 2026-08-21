import type { Metadata } from 'next'
import '../src/styles.css'

export const metadata: Metadata = {
  title: 'Simbionte Joyas',
  description: 'Joyería de autor hecha a mano en Valdivia, Chile.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  )
}
