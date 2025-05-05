"use client"

import { useState } from 'react';
import { MacWindow } from '@/components/MacWindow';
import { useAppContext } from '@/context/AppContext';

interface NotepadProps {
  id: string;
  name: string;
  position: { x: number; y: number };
  zIndex: number;
}

export function Notepad({ id, name, position, zIndex }: NotepadProps) {
  const { bringToFront } = useAppContext();
  const [text, setText] = useState('');
  
  return (
    <MacWindow
      title={name}
      width="w-[400px]"
      height="h-[350px]"
      defaultPosition={position}
      zIndex={zIndex}
      onFocus={() => bringToFront(id)}
      id={id}
      minWidth={250}
      minHeight={200}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center p-2 bg-gray-200 border-b border-gray-400">
          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">File</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Edit</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Format</button>
          </div>
        </div>
        
        <div className="flex-1 p-2 h-full">
          <textarea 
            className="w-full h-full p-2 text-sm border border-gray-300 resize-none focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your notes here... Resize this window by dragging the bottom-right corner!"
          />
        </div>
        
        <div className="p-2 bg-gray-200 border-t border-gray-400 text-xs flex justify-between">
          <span>{text.length} characters</span>
          <span>Resizable window</span>
        </div>
      </div>
    </MacWindow>
  );
} 