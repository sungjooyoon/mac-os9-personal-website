import { MacFolder } from '@/components/MacFolder'
import { OpenApps } from '@/components/OpenApps'
import { MacDock } from '@/components/MacDock'
import { MacWallpaper } from '@/components/MacWallpaper'
import { useEffect, useState } from 'react'

export function MacDesktop() {
  const [windowSize, setWindowSize] = useState({
    width: 1024,
    height: 768
  });
  
  useEffect(() => {
    // Update window size on client-side only to avoid hydration mismatch
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate positions for desktop icons - using fixed value for initial render
  const desktopIconsRight = 80;
  
  return (
    <div className="flex flex-1 overflow-hidden relative w-full h-full">
      {/* Custom wallpaper with right-click to change */}
      <MacWallpaper />
      
      {/* Desktop icons */}
      <div 
        className="absolute flex flex-col items-center gap-5 z-10"
        style={{ 
          right: '28px', 
          top: '40px',
          maxWidth: '80px'
        }}
      >
        <MacFolder 
          name="About Me" 
          icon="/assets/finder.png"
          appType="aboutme" 
        />
        
        <div className="ml-2">
          <MacFolder 
            name="Blog" 
            icon="/assets/blog.png"
            appType="blog" 
          />
        </div>
        
        <MacFolder 
          name="Terminal" 
          icon="/assets/terminal.png"
          appType="terminal" 
        />
      </div>
      
      {/* System apps are managed through the AppContext */}
      <OpenApps />
      
      {/* Mac Dock */}
      <MacDock />
    </div>
  )
} 