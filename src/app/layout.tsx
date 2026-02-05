import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import GlobalBackground from '../components/GlobalBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YUKI - LLM-Powered Security Analyzer',
  description: 'Defend Your Crypto Assets with YUKI - AI-powered security scanning for smart contracts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <GlobalBackground />
          {children}
        </Providers>
      </body>
    </html>
  )
}