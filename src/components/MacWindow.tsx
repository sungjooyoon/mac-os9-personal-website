"use client"

import { ReactNode, useState, useRef, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'

interface MacWindowProps {
  title: string
  children: ReactNode
  width?: string
  height?: string
  statusText?: string
  itemCount?: number
  diskSpace?: string
  zIndex?: number
  onFocus?: () => void
  defaultPosition?: { x: number, y: number }
  id?: string
  minWidth?: number
  minHeight?: number
  isActive?: boolean
  customStyles?: React.CSSProperties
}

export function MacWindow({ 
  title, 
  children, 
  statusText,
  itemCount,
  diskSpace,
  zIndex = 1,
  onFocus,
  defaultPosition = { x: 0, y: 0 },
  id,
  minWidth = 200,
  minHeight = 100,
  isActive = true,
  customStyles
}: MacWindowProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 400, height: 300 });
  const [originalSize, setOriginalSize] = useState<{ width: number, height: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState(isActive);
  const windowRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const minimizeButtonRef = useRef<HTMLDivElement>(null);
  const maximizeButtonRef = useRef<HTMLDivElement>(null);
  const { closeApp, bringToFront, minimizeApp, openApps } = useAppContext();
  
  // Find the current app to check if it's minimized and get any custom size
  const currentApp = id ? openApps.find(app => app.id === id) : undefined;
  const isMinimized = currentApp?.isMinimized || false;
  
  // Initialize the window size on mount
  useEffect(() => {
    // Check if the app has a predefined size in context
    if (currentApp?.size) {
      setWindowSize(currentApp.size);
    } else if (windowRef.current) {
      const computedStyle = getComputedStyle(windowRef.current);
      const initialWidth = parseInt(computedStyle.width) || 400;
      const initialHeight = parseInt(computedStyle.height) || 300;
      
      setWindowSize({
        width: initialWidth,
        height: initialHeight
      });
    }
  }, [currentApp]);

  // Setup button listeners using direct DOM manipulation
  useEffect(() => {
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '×';
    closeBtn.id = `close-btn-${id}`;
    closeBtn.style.position = 'absolute';
    closeBtn.style.left = '4px';
    closeBtn.style.top = '3px';
    closeBtn.style.width = '12px';
    closeBtn.style.height = '12px';
    closeBtn.style.backgroundColor = '#ff5f57';
    closeBtn.style.border = '1px solid #e33e32';
    closeBtn.style.fontSize = '12px';
    closeBtn.style.lineHeight = '10px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.color = '#990000';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '9999';
    closeBtn.style.textAlign = 'center';
    closeBtn.style.paddingLeft = '1px';
    closeBtn.style.paddingBottom = '1px';
    
    const minBtn = document.createElement('div');
    minBtn.innerHTML = '−';
    minBtn.id = `min-btn-${id}`;
    minBtn.style.position = 'absolute';
    minBtn.style.left = '22px';
    minBtn.style.top = '3px';
    minBtn.style.width = '12px';
    minBtn.style.height = '12px';
    minBtn.style.backgroundColor = '#ffbd2e';
    minBtn.style.border = '1px solid #e09e1a';
    minBtn.style.fontSize = '12px';
    minBtn.style.lineHeight = '10px';
    minBtn.style.fontWeight = 'bold';
    minBtn.style.color = '#985700';
    minBtn.style.display = 'flex';
    minBtn.style.alignItems = 'center';
    minBtn.style.justifyContent = 'center';
    minBtn.style.cursor = 'pointer';
    minBtn.style.zIndex = '9999';
    minBtn.style.textAlign = 'center';
    
    const maxBtn = document.createElement('div');
    maxBtn.innerHTML = '+';
    maxBtn.id = `max-btn-${id}`;
    maxBtn.style.position = 'absolute';
    maxBtn.style.left = '40px';
    maxBtn.style.top = '3px';
    maxBtn.style.width = '12px';
    maxBtn.style.height = '12px';
    maxBtn.style.backgroundColor = '#28c941';
    maxBtn.style.border = '1px solid #14ae2c';
    maxBtn.style.fontSize = '12px';
    maxBtn.style.lineHeight = '10px';
    maxBtn.style.fontWeight = 'bold';
    maxBtn.style.color = '#006400';
    maxBtn.style.display = 'flex';
    maxBtn.style.alignItems = 'center';
    maxBtn.style.justifyContent = 'center';
    maxBtn.style.cursor = 'pointer';
    maxBtn.style.zIndex = '9999';
    maxBtn.style.textAlign = 'center';
    maxBtn.style.paddingLeft = '1px';
    maxBtn.style.paddingBottom = '1px';
    
    // Add the buttons to the DOM
    if (windowRef.current) {
      const header = windowRef.current.querySelector('.mac-window-header');
      if (header) {
        header.appendChild(closeBtn);
        header.appendChild(minBtn);
        header.appendChild(maxBtn);
        
        // Attach event listeners
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (id) closeApp(id);
        });
        
        minBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (id) minimizeApp(id);
        });
        
        maxBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          maximizeWindow();
        });
      }
    }
    
    // Cleanup
    return () => {
      closeBtn.remove();
      minBtn.remove();
      maxBtn.remove();
    };
  }, [id, closeApp, minimizeApp]);

  // Function to maximize the window
  const maximizeWindow = () => {
    // Save current size before maximizing if not already maximized
    if (!originalSize) {
      setOriginalSize({ width: windowSize.width, height: windowSize.height });
      
      // Calculate ~90% of window size for maximized view
      const maxWidth = Math.round(window.innerWidth * 0.9);
      const maxHeight = Math.round(window.innerHeight * 0.9);
      
      setWindowSize({ width: maxWidth, height: maxHeight });
      
      // Center the window
      if (windowRef.current) {
        const newLeft = Math.round((window.innerWidth - maxWidth) / 2);
        const newTop = Math.round((window.innerHeight - maxHeight) / 2);
        setPosition({ x: newLeft, y: newTop });
      }
    } else {
      // Restore to original size
      setWindowSize({ ...originalSize });
      setOriginalSize(null);
    }
  };

  // Fix the dragging functionality
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        
        // Calculate new position based on mouse position and offset
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        
        // Ensure the window stays within the viewport bounds
        const maxX = window.innerWidth - (windowSize.width / 2);
        const maxY = window.innerHeight - (windowSize.height / 2);
        
        newPosition.x = Math.max(-(windowSize.width / 2), Math.min(newPosition.x, maxX));
        newPosition.y = Math.max(0, Math.min(newPosition.y, maxY));
        
        setPosition(newPosition);
      }
    };
    
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        setIsDragging(false);
      }
    };
    
    // Add global event listeners
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset, windowSize]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Skip if clicking in the area where buttons are
    if (e.nativeEvent.offsetX < 70 && e.nativeEvent.offsetY < 20) {
      return;
    }
    
    // Only handle dragging from the header
    if (!(e.target as HTMLElement).closest('.mac-window-header')) return;
    
    e.preventDefault();
    e.stopPropagation();
    setActive(true);
    
    // Calculate the offset from the mouse to the window's corner
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      // Set isDragging after setting the offset to ensure the effect picks up correctly
      setIsDragging(true);
    }
    
    if (onFocus && id) {
      bringToFront(id);
      onFocus();
    }
  };
  
  const handleWindowClick = () => {
    setActive(true);
    if (onFocus && id) {
      bringToFront(id);
      onFocus();
    }
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setActive(true);
    if (onFocus && id) {
      bringToFront(id);
      onFocus();
    }
    
    setIsResizing(true);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: windowSize.width, height: windowSize.height });
    
    // Add resize event listeners
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle resize movement
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - initialMousePos.x;
    const deltaY = e.clientY - initialMousePos.y;
    
    const newWidth = Math.max(minWidth, initialSize.width + deltaX);
    const newHeight = Math.max(minHeight, initialSize.height + deltaY);
    
    setWindowSize({ width: newWidth, height: newHeight });
  };

  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false);
    
    // Remove resize event listeners
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  // Clean up resize listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing]);
  
  // Handle repositioning when screen is resized
  useEffect(() => {
    const handleWindowResize = () => {
      if (windowRef.current) {
        // Ensure window stays within screen bounds when browser resizes
        let newPos = { ...position };
        const rightMargin = 80; // Space for desktop icons
        
        // Check if window is off-screen and adjust
        if (newPos.x + windowSize.width > window.innerWidth - rightMargin) {
          newPos.x = Math.max(0, window.innerWidth - windowSize.width - rightMargin);
        }
        
        if (newPos.y + windowSize.height > window.innerHeight) {
          newPos.y = Math.max(0, window.innerHeight - windowSize.height);
        }
        
        // Apply new position if it changed
        if (newPos.x !== position.x || newPos.y !== position.y) {
          setPosition(newPos);
        }
      }
    };
    
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [position, windowSize]);
  
  return (
    <div 
      ref={windowRef}
      className="mac-window"
      style={{
        width: customStyles?.width || `${windowSize.width}px`,
        height: customStyles?.height || `${windowSize.height}px`,
        zIndex: isDragging || isResizing ? 10 : zIndex,
        left: position.x,
        top: position.y,
        position: 'absolute',
        overflow: 'hidden',
        display: isMinimized ? 'none' : 'flex',
        ...(customStyles && { 
          maxWidth: customStyles.maxWidth,
          maxHeight: customStyles.maxHeight
        })
      }}
      onClick={handleWindowClick}
    >
      <div 
        className={`mac-window-header ${active ? 'active' : ''} cursor-move`} 
        onMouseDown={handleMouseDown}
      >
        <div 
          className="mac-window-title" 
        >
          {title}
        </div>
      </div>
      
      {/* Window content with full-width separator */}
      {(itemCount || diskSpace) && (
        <div className="items-info">
          {itemCount && diskSpace ? (
            `${itemCount} items, ${diskSpace} available`
          ) : itemCount ? (
            `${itemCount} items`
          ) : (
            `${diskSpace} available`
          )}
        </div>
      )}
      
      <div 
        className="mac-window-content mac-os9-paper" 
        style={{ 
          borderTop: '1px solid #acacac', 
          width: '100%', 
          marginLeft: '-1px', 
          marginRight: '-1px',
          paddingLeft: '1px'
        }}
      >
        {children}
      </div>
      
      {statusText && (
        <div className="mac-status-bar">
          <span>{statusText}</span>
        </div>
      )}
  
      <div 
        className="resize-handle"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '15px',
          height: '15px',
          cursor: 'nwse-resize'
        }}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
} 