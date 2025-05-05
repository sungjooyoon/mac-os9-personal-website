"use client"

import { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'

interface MacFolderProps {
  name: string;
  href?: string;
  icon?: string;
  emoji?: string;
  color?: string;
  appType?: string;
}

export function MacFolder({ 
  name, 
  href = "#", 
  icon, 
  emoji = "📁", 
  color = "bg-yellow-100",
  appType 
}: MacFolderProps) {
  const { openApp } = useAppContext();
  const [customIcon, setCustomIcon] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  // Load custom icon from localStorage if available
  useEffect(() => {
    // Always reset Blog and Terminal to their default icons
    if (name === 'Blog' || name === 'Terminal') {
      localStorage.removeItem(`icon-${name}`);
      setCustomIcon(null);
      return;
    }
    const savedIcon = localStorage.getItem(`icon-${name}`);
    if (savedIcon) {
      setCustomIcon(savedIcon);
    }
  }, [name]);
  
  // Simple ID generator based on timestamp and random number
  const generateId = () => `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!appType) return;
    
    // Calculate a position that's centered but slightly randomized
    const position = {
      x: Math.max(50, Math.min(window.innerWidth - 400, (window.innerWidth / 2) - 200 + (Math.random() * 100 - 50))),
      y: Math.max(50, Math.min(window.innerHeight - 300, (window.innerHeight / 2) - 150 + (Math.random() * 100 - 50)))
    };
    
    openApp({
      id: generateId(),
      name,
      type: appType,
      position
    });
  };
  
  // Handle setting a custom icon
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomIcon(dataUrl);
        localStorage.setItem(`icon-${name}`, dataUrl);
        setShowIconPicker(false);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Right-click handler to show custom icon picker
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowIconPicker(true);
  };
  
  // Helper function to determine icon content
  const getIconContent = () => {
    // If we have a custom icon, use that
    if (customIcon) {
      return <img src={customIcon} alt={name} className="w-16 h-16 object-contain" />;
    }
    
    // If an icon path is provided, use that image
    if (icon) {
      if (name === "Blog") {
        return <div className="flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
          <img 
            src={icon} 
            alt={name} 
            className="object-contain"
            style={{ 
              maxWidth: '127.5%', 
              maxHeight: '127.5%',
              transform: 'scale(1.275)'
            }}
          />
        </div>;
      } else if (name === "Terminal") {
        return <div className="flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
          <img 
            src={icon} 
            alt={name} 
            className="object-contain"
            style={{ 
              maxWidth: '112%', 
              maxHeight: '112%',
              transform: 'scale(1.12)'
            }}
          />
        </div>;
      }
      return <img 
        src={icon} 
        alt={name} 
        className="w-16 h-16 object-contain" 
      />;
    }
    
    // Otherwise use default emoji icons
    if (name.includes('Folder') || name.includes('Documents') || name.includes('Utilities')) {
      return <span className="text-5xl">📁</span>;
    } else if (name === 'Trash') {
      return <span className="text-5xl">🗑️</span>;
    } else if (name === 'My Home') {
      return <span className="text-5xl">🏠</span>;
    } else if (name === 'Network' || name.includes('Internet')) {
      return <span className="text-5xl">🌐</span>;
    } else if (name.includes('Application')) {
      return <span className="text-5xl">💿</span>;
    } else {
      return <span className="text-5xl">{emoji}</span>;
    }
  };
  
  // Display a shortened version of the name below the icon
  const getDisplayName = () => {
    if (name.length > 15) {
      return name.substring(0, 12) + '...';
    }
    return name;
  };
  
  return (
    <>
      <a 
        href={href} 
        className="mac-folder flex flex-col items-center text-center"
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        <div className="mac-folder-icon-wrapper">
          {getIconContent()}
        </div>
        <div className="flex justify-center w-full">
          <span className="mac-folder-name italic" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            padding: '0px 3px',
            borderRadius: '0',
            fontFamily: 'FindersKeepers, Chicago, monospace',
            fontSize: '12px',
            lineHeight: '1.2',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            transform: 'scale(1, 1.05)',
            minWidth: 'auto',
            maxWidth: 'max-content',
            boxSizing: 'content-box',
            marginLeft: name === 'Blog' ? '-8px' : '0px'
          }}>
            {getDisplayName()}
          </span>
        </div>
      </a>
      
      {/* Custom icon picker modal */}
      {showIconPicker && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg mac-window">
            <div className="mac-window-header cursor-move">
              <div className="mac-window-title">Change Icon for {name}</div>
            </div>
            <div className="p-4">
              <p className="mb-4">Select a new icon image:</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="mb-4"
              />
              <div className="flex justify-end">
                <button 
                  className="mr-2 px-4 py-1 border border-gray-400 rounded"
                  onClick={() => setShowIconPicker(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-1 bg-gray-200 border border-gray-400 rounded"
                  onClick={() => {
                    setCustomIcon(null);
                    localStorage.removeItem(`icon-${name}`);
                    setShowIconPicker(false);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 