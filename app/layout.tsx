import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weather Forecast Investment Game',
  description: '気象投資ゲームへようこそ！',
  generator: 'Weather Forecast Investment Game',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
