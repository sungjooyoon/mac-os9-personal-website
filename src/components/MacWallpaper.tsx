"use client"

export function MacWallpaper() {
  // Create Mac OS 9 wallpaper using CSS
  return (
    <div 
      className="fixed inset-0 z-0 mac-os9-wallpaper"
      style={{
        backgroundImage: `url('/assets/wallpaperdefault.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
} 