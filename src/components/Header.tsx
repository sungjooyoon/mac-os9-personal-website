import Link from 'next/link'
import { navigationLinks, siteConfig } from '@/config/site'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <nav className="flex flex-1 items-center justify-end space-x-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
} 