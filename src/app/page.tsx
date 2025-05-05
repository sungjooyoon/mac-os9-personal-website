"use client"

import { MacDesktop } from '@/components/MacDesktop'
import { siteConfig } from '@/config/site'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MacDesktop />
    </div>
  )
}
