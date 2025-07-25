import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Answer Me',
  description: 'Interactive sound board with 4 engaging buttons',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="font-sans">{children}</body>
    </html>
  )
}