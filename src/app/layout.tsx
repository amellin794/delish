import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { SiteHeader } from '@/components/site-header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Delish - Google Maps List Paywall',
  description: 'Sell access to your curated Google Maps lists in seconds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SiteHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
