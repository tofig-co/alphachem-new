import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alphachem',
  description: 'Kimyəvi xammal tədarükü və marketinq şirkəti',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
