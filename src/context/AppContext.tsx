"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface OpenApp {
  id: string;
  name: string;
  type: string;
  zIndex: number;
  position: { x: number, y: number };
  size?: { width: number, height: number };
  closing?: boolean;
  isMinimized?: boolean;
}

interface AppContextType {
  openApps: OpenApp[];
  openApp: (app: Omit<OpenApp, 'zIndex'>) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  bringToFront: (id: string) => void;
  updateAppSize?: (id: string, size: { width: number, height: number }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [initialized, setInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);

  // Set up a resize listener to adjust app positions when window size changes
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const prevWidth = screenSize.width;
      const prevHeight = screenSize.height;
      
      // Calculate scale factors
      const widthRatio = newWidth / prevWidth;
      const heightRatio = newHeight / prevHeight;
      
      setScreenSize({
        width: newWidth,
        height: newHeight
      });
      
      // Update app positions and sizes to ensure they stay in bounds and scaled appropriately
      setOpenApps(prevApps => {
        return prevApps.map(app => {
          // If we're mobile, use fixed positioning
          if (newWidth < 768) {
            // For mobile, set fixed positions based on app type
            let mobilePosition = getMobilePosition(app.type);
            
            // Use mobile size constraints
            const newSize = {
              width: Math.min(newWidth - 20, 600),
              height: app.size ? Math.min(newHeight * 0.7, app.size.height) : Math.min(newHeight * 0.5, 400)
            };
            
            return {
              ...app,
              position: mobilePosition,
              size: newSize
            };
          }
          
          // Regular desktop positioning logic
          // Calculate new position based on scaling ratio
          const newPosition = { 
            x: Math.round(app.position.x * widthRatio),
            y: Math.round(app.position.y * heightRatio)
          };
          
          // Calculate new size based on scaling ratio
          let newSize = app.size ? {
            width: Math.round(app.size.width * widthRatio),
            height: Math.round(app.size.height * heightRatio)
          } : undefined;
          
          // Reserve space for desktop icons (minimum 80px from right edge)
          const rightMargin = Math.max(90, newWidth * 0.08);
          
          // Keep apps within the visible area and ensure they don't overlap desktop icons
          if (newPosition.x + (newSize?.width || 200) > newWidth - rightMargin) {
            newPosition.x = Math.max(10, newWidth - rightMargin - (newSize?.width || 200));
          }
          
          if (newPosition.y + (newSize?.height || 150) > newHeight) {
            newPosition.y = Math.max(30, newHeight - (newSize?.height || 150) - 20);
          }
          
          // Ensure windows aren't too big
          if (newSize) {
            // Max width: 90% of screen minus right margin
            const maxWidth = newWidth * 0.9 - rightMargin;
            if (newSize.width > maxWidth) {
              const ratio = maxWidth / newSize.width;
              newSize.width = Math.round(maxWidth);
              newSize.height = Math.round(newSize.height * ratio);
            }
            
            // Max height: 90% of screen height
            const maxHeight = newHeight * 0.9;
            if (newSize.height > maxHeight) {
              const ratio = maxHeight / newSize.height;
              newSize.height = Math.round(maxHeight);
              newSize.width = Math.round(newSize.width * ratio);
            }
          }
          
          return {
            ...app,
            position: newPosition,
            size: newSize
          };
        });
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [screenSize]);

  // Helper function to get fixed mobile positions based on app type
  const getMobilePosition = (appType: string): { x: number, y: number } => {
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    // Fixed positions for different app types on mobile
    switch (appType) {
      case 'aboutme':
        return { x: 10, y: 50 };
      case 'blog':
        return { x: 10, y: 70 };
      case 'terminal':
        return { x: 10, y: 90 };
      case 'photos':
        return { x: 10, y: 110 };
      case 'notes':
        return { x: 10, y: 130 };
      default:
        // Default position for any other app type
        return { x: 10, y: 150 };
    }
  };

  // Initialize default apps on first mount
  useEffect(() => {
    if (!initialized) {
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      
      // Check if device is mobile (screen width less than 768px)
      const isMobile = screenWidth < 768;
      
      // Define positions and sizes based on device type
      let aboutMePosition, blogPosition, terminalPosition;
      let aboutMeWidth, aboutMeHeight, blogWidth, terminalWidth, terminalHeight;
      
      if (isMobile) {
        // Mobile positions - fixed positions from top
        aboutMePosition = { x: 10, y: 50 };
        blogPosition = { x: 10, y: 70 };
        terminalPosition = { x: 10, y: 90 };
        
        // Mobile sizes - nearly full width and proportional height
        aboutMeWidth = Math.round(screenWidth - 20);
        aboutMeHeight = Math.round(screenHeight * 0.7);
        blogWidth = Math.round(screenWidth - 20);
        terminalWidth = Math.round(screenWidth - 20);
        terminalHeight = Math.round(screenHeight * 0.4);
      } else {
        // Desktop positions - spaced out across the screen
        aboutMePosition = { 
          x: isMobile ? screenWidth * 0.02 : screenWidth * 0.03, // Closer to left edge on mobile
          y: screenHeight * 0.05  // Higher up (5% of screen height)
        };
        
        blogPosition = { 
          x: screenWidth * 0.43, // 43% of screen width for more balanced spacing (slightly adjusted from 42%)
          y: screenHeight * 0.05  // Same height as About Me
        };
        
        terminalPosition = {
          x: isMobile ? screenWidth * 0.02 : screenWidth * 0.50, // Slight adjustment to the left (from 0.55 to 0.50)
          y: screenHeight * 0.54 // Adjusted position (54% of screen height)
        };
        
        // Desktop sizes - proportional to screen
        aboutMeWidth = isMobile ? Math.round(screenWidth * 0.96) : Math.round(screenWidth * 0.38);
        aboutMeHeight = isMobile ? Math.round(screenHeight * 0.9) : Math.round(screenHeight * 0.78);
        blogWidth = Math.round(screenWidth * 0.48); // 48% of screen width
        terminalWidth = Math.min(600, Math.round(screenWidth * 0.47)); // Wider terminal (47% of screen width)
        terminalHeight = Math.min(400, Math.round(screenHeight * 0.37)); // 37% of screen height (was 32%)
      }
      
      // Open About Me by default on mobile, both About Me and Blog on desktop
      const newApps: OpenApp[] = [
        {
          id: `aboutme_default`,
          name: 'About Me',
          type: 'aboutme',
          position: aboutMePosition,
          zIndex: 1,
          isMinimized: false,
          size: {
            width: aboutMeWidth,
            height: aboutMeHeight
          }
        }
      ];
      
      // Only add Blog app on desktop by default
      if (!isMobile) {
        newApps.push({
          id: `blog_default`,
          name: 'Blog',
          type: 'blog',
          position: blogPosition,
          zIndex: 2,
          isMinimized: false,
          size: {
            width: blogWidth,
            height: Math.round(screenHeight * 0.70)
          }
        });
        
        // Add Terminal app on desktop, with higher z-index to be on top
        newApps.push({
          id: `terminal_default`,
          name: 'Terminal',
          type: 'terminal',
          position: terminalPosition,
          zIndex: 3,
          isMinimized: false,
          size: {
            width: terminalWidth,
            height: terminalHeight
          }
        });
      }
      
      setOpenApps(newApps);
      setMaxZIndex(isMobile ? 1 : 3); // Update max z-index to account for Terminal
      setInitialized(true);
    }
  }, [initialized]);

  const openApp = (app: Omit<OpenApp, 'zIndex'>) => {
    // Check if an app of this type is already open
    const existingAppOfSameType = openApps.find(a => a.type === app.type);
    
    if (existingAppOfSameType) {
      // If it is, bring it to front
      bringToFront(existingAppOfSameType.id);
      return;
    }
    
    // Check if app with same ID is already open (fallback check)
    if (openApps.find(a => a.id === app.id)) {
      // If it is, bring it to front
      bringToFront(app.id);
      return;
    }

    const newMaxZIndex = maxZIndex + 1;
    setMaxZIndex(newMaxZIndex);
    
    // For mobile devices, use fixed positioning
    let position = app.position;
    let size = app.size;
    
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      // Use fixed mobile positions based on app type
      position = getMobilePosition(app.type);
      
      // Set mobile-friendly size if not specified
      if (!size) {
        size = {
          width: window.innerWidth - 20,
          height: Math.min(400, window.innerHeight * 0.6)
        };
      }
    }
    
    setOpenApps([
      ...openApps,
      { 
        ...app, 
        position,
        size,
        zIndex: newMaxZIndex, 
        isMinimized: false 
      }
    ]);
  };

  const closeApp = (id: string) => {
    // First mark the app as closing to prevent re-renders
    setOpenApps(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, closing: true } 
          : app
      )
    );
    
    // Then actually remove it after a brief delay to prevent flashing
    setTimeout(() => {
      setOpenApps(prev => prev.filter(app => app.id !== id));
    }, 50);
  };

  const minimizeApp = (id: string) => {
    const app = openApps.find(a => a.id === id);
    if (!app || app.closing) return;

    setOpenApps(
      openApps.map(a => 
        a.id === id 
          ? { ...a, isMinimized: !a.isMinimized } 
          : a
      )
    );
  };

  const bringToFront = (id: string) => {
    const app = openApps.find(a => a.id === id);
    if (!app || app.closing) return;

    const newMaxZIndex = maxZIndex + 1;
    setMaxZIndex(newMaxZIndex);

    setOpenApps(
      openApps.map(a => 
        a.id === id 
          ? { ...a, zIndex: newMaxZIndex, isMinimized: false } 
          : a
      )
    );
  };
  
  const updateAppSize = (id: string, size: { width: number, height: number }) => {
    setOpenApps(
      openApps.map(a => 
        a.id === id 
          ? { ...a, size } 
          : a
      )
    );
  };

  return (
    <AppContext.Provider value={{ 
      openApps, 
      openApp, 
      closeApp, 
      minimizeApp,
      bringToFront,
      updateAppSize
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 