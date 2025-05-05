import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { MacHeader } from '@/components/MacHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sungjoo's Website",
  description: "A personal website with a Mac OS 9 aesthetic",
  icons: {
    icon: [
      {
        url: '/images/pear1.png',
        type: 'image/png',
      }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <MacHeader />
        {children}
        </AppProvider>
      </body>
    </html>
  )
}
