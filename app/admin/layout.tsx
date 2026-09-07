import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Administración · Simbionte Joyas',
  robots: { index: false, follow: false },
  icons: { icon: '/icon' },
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
