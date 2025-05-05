"use client"

import { useAppContext } from '@/context/AppContext';
import { useState, useEffect } from 'react';

interface DockItem {
  id: string;
  name: string;
  icon?: string;
  iconType: string;
  type: string;
}

export function MacDock() {
  const { openApp, openApps } = useAppContext();
  const [activeApps, setActiveApps] = useState<Record<string, boolean>>({});
  
  // Update active apps when openApps changes
  useEffect(() => {
    const newActiveApps: Record<string, boolean> = {};
    openApps.forEach(app => {
      newActiveApps[app.type] = true;
    });
    setActiveApps(newActiveApps);
  }, [openApps]);
  
  const dockItems: DockItem[] = [
    {
      id: 'aboutme',
      name: 'About Me',
      iconType: 'aboutme-icon',
      type: 'aboutme'
    },
    {
      id: 'blog',
      name: 'Blog',
      iconType: 'blog-icon',
      type: 'blog'
    },
    {
      id: 'terminal',
      name: 'Terminal',
      iconType: 'terminal-icon',
      type: 'terminal'
    }
  ];
  
  const handleOpenApp = (app: DockItem) => {
    // Generate a unique ID for this app instance
    const uniqueId = `${app.id}_${Date.now()}`;
    
    openApp({
      id: uniqueId,
      name: app.name,
      type: app.type,
      position: { x: 100, y: 100 }
    });
  };
  
  // Helper function to render icon content with custom icon
  const renderIconContent = (iconType: string) => {
    switch (iconType) {
      case 'aboutme-icon':
        return (
          <div className="mac-icon-inner">
            <img 
              src="/assets/finder.png" 
              alt="About Me" 
              className="icon-image"
              style={{ objectFit: 'contain', objectPosition: 'center', width: '22px', height: '22px' }}
            />
          </div>
        );
      case 'blog-icon':
        return (
          <div className="mac-icon-inner" style={{ transform: 'scale(1.25)', marginLeft: '2px' }}>
            <img 
              src="/assets/blog.png" 
              alt="Blog" 
              className="icon-image"
              style={{ objectFit: 'contain', objectPosition: 'center', width: '32px', height: '32px' }}
            />
          </div>
        );
      case 'terminal-icon':
        return (
          <div className="mac-icon-inner">
            <img 
              src="/assets/terminal.png" 
              alt="Terminal" 
              className="icon-image"
              style={{ objectFit: 'contain', objectPosition: 'center', width: '24px', height: '24px' }}
            />
          </div>
        );
      default:
        return <div className="mac-icon-inner"></div>;
    }
  };
  
  return (
    <div className="mac-dock">
      <div className="mac-dock-inner">
        {dockItems.map((item, index) => (
          <div 
            key={item.id}
            className="mac-dock-item"
            onClick={() => handleOpenApp(item)}
          >
            <div className="mac-dock-item-container" style={{
              boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #888',
              background: 'linear-gradient(to bottom, #e8e8e8, #d0d0d0)',
              borderRadius: '3px',
            }}>
              <div className={`mac-dock-icon ${item.iconType}`}>
                {renderIconContent(item.iconType)}
              </div>
              <div className="mac-dock-indicator" style={{ width: '12px', minWidth: '12px', display: 'flex', alignItems: 'center' }}>
                {activeApps[item.type] && (
                  <div className="mac-dock-arrow">▶</div>
                )}
              </div>
            </div>
            {index < dockItems.length - 1 && <div className="mac-dock-divider"></div>}
          </div>
        ))}
      </div>
      
      {/* Right edge piece */}
      <div className="mac-dock-edge">
        <div className="mac-dock-edge-inner"></div>
      </div>
    </div>
  );
}

// Add this CSS to globals.css:
/*
.mac-dock {
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: flex;
  z-index: 1000;
}

.mac-dock-inner {
  background: #d4d4d4;
  border: 1px solid #000;
  border-radius: 6px 0 0 6px;
  box-shadow: 
    inset 1px 1px 0 #fff, 
    inset -1px -1px 0 #888, 
    2px 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  padding: 6px 8px;
  gap: 12px;
}

.mac-dock-edge {
  height: 100%;
  width: 16px;
  overflow: hidden;
  position: relative;
}

.mac-dock-edge-inner {
  position: absolute;
  height: 100%;
  width: 32px;
  border-radius: 6px;
  background: #d4d4d4;
  border: 1px solid #000;
  box-shadow: 
    inset 1px 1px 0 #fff, 
    inset -1px -1px 0 #888, 
    2px 2px 4px rgba(0, 0, 0, 0.3);
  left: -16px;
}

.mac-dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.mac-dock-item-inner {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mac-dock-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  position: relative;
  overflow: hidden;
}

.mac-dock-indicator {
  display: flex;
  align-items: center;
  height: 100%;
}

.mac-dock-arrow {
  font-size: 9px;
  color: #333;
  margin-bottom: 0;
  line-height: 1;
  font-family: 'Chicago', monospace;
}

.mac-icon-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}
*/ 