import Link from 'next/link'
import { homeConfig } from '@/config/site'

export function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        {homeConfig.headline}
      </h1>
      <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">
        {homeConfig.subheadline}
      </p>
      <p className="mt-4 max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
        {homeConfig.introduction}
      </p>
      <div className="mt-8">
        <Link
          href={homeConfig.ctaLink}
          className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          {homeConfig.ctaText}
        </Link>
      </div>
    </section>
  )
} 