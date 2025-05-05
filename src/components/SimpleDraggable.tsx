"use client"

import { ReactNode, useState, useRef, useEffect, MouseEvent } from 'react'

interface SimpleDraggableProps {
  children: ReactNode;
  handleSelector: string;
  defaultPosition?: { x: number; y: number };
  onStart?: () => void;
  onStop?: () => void;
  bounds?: string;
}

export function SimpleDraggable({
  children,
  handleSelector,
  defaultPosition = { x: 0, y: 0 },
  onStart,
  onStop,
  bounds
}: SimpleDraggableProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const boundingRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (bounds && bounds === 'parent' && elementRef.current) {
      boundingRef.current = elementRef.current.parentElement;
    }
  }, [bounds]);

  const handleMouseDown = (e: MouseEvent) => {
    // Check if the clicked target is the handle or a child of the handle
    const target = e.target as HTMLElement;
    const isHandle = target.closest(handleSelector);
    
    // If this is not a handle drag, allow the event to propagate to children
    if (!isHandle) return;
    
    setIsDragging(true);
    if (onStart) onStart();

    // Calculate the offset between mouse and the top-left corner of draggable element
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    // Add event listeners directly
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent default behavior and text selection
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    // Apply bounding if needed
    if (boundingRef.current) {
      const parentRect = boundingRef.current.getBoundingClientRect();
      const childRect = elementRef.current?.getBoundingClientRect();
      
      if (childRect) {
        newX = Math.max(0, Math.min(newX, parentRect.width - childRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - childRect.height));
      }
    }
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (onStop) onStop();
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  return (
    <div
      ref={elementRef}
      style={{ 
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: isDragging ? 'none' : 'auto',
        zIndex: isDragging ? 1000 : 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
} 