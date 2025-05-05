"use client"

import { useAppContext } from '@/context/AppContext';
import { useState, useRef, useEffect } from 'react';
import { MacWindow } from '@/components/MacWindow';

interface AboutSungjooProps {
  id: string;
  name: string;
  position: { x: number, y: number };
  zIndex: number;
}

export function AboutSungjoo({ id, name, zIndex }: AboutSungjooProps) {
  const { bringToFront } = useAppContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // Set window size to fill about 80% of the screen width, leaving room for desktop icons
  useEffect(() => {
    const calculateSize = () => {
      const width = Math.min(window.innerWidth * 0.8, window.innerWidth - 120);
      // Ensure height doesn't exceed space above the dock
      const height = Math.min(window.innerHeight * 0.8, window.innerHeight - 150);
      setWindowSize({ width, height });
    };
    
    calculateSize();
    window.addEventListener('resize', calculateSize);
    
    return () => {
      window.removeEventListener('resize', calculateSize);
    };
  }, []);

  const handleClick = () => {
    bringToFront(id);
  };

  // Position at top-left with room for desktop elements
  const windowPosition = {
    x: 30,
    y: 40
  };

  return (
    <MacWindow
      id={id}
      title={name}
      defaultPosition={windowPosition}
      zIndex={zIndex}
      onFocus={handleClick}
      customStyles={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        maxWidth: 'calc(100vw - 160px)', // Leave space for icons
        maxHeight: 'calc(100vh - 150px)'  // Space above dock
      }}
      isActive={true}
    >
      <div 
        className="p-4 h-full overflow-auto"
        ref={contentRef}
      >
        <div className="italic">
          <h2 className="text-xl mb-4">Hello, I&apos;m Sungjoo</h2>
          
          <p className="mb-3">
            Welcome to my personal website styled after Mac OS 9! This nostalgic interface pays homage to the classic Apple operating system that many of us grew up with.
          </p>
          
          <p className="mb-3">
            I&apos;m a passionate developer who loves blending modern technology with retro aesthetics. This site showcases my work, interests, and creative projects.
          </p>
          
          <p className="mb-3">
            Feel free to explore and interact with this Mac OS 9-inspired environment. The attention to detail includes classic UI elements like window controls, the iconic Chicago font, and that signature blue-purple wallpaper pattern.
          </p>
          
          <h3 className="text-lg mb-2 mt-6">About Me</h3>
          <p className="mb-3">
            I specialize in web development, with expertise in React, Next.js, and UI/UX design. My passion for technology is matched only by my enthusiasm for creating memorable user experiences.
          </p>
          
          <h3 className="text-lg mb-2 mt-6">Contact</h3>
          <p className="mb-3">
            Feel free to reach out to me for collaborations, questions, or just to say hello!
          </p>
        </div>
      </div>
    </MacWindow>
  );
} 