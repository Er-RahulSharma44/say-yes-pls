import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Valentine's Proposal Creator",
  description: 'Create a fun and interactive valentine proposal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

