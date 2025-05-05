import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            {siteConfig.name}
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4"
          >
            Twitter
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
} 