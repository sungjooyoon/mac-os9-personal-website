"use client"

import { MacWindow } from '@/components/MacWindow';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

interface QuickTimePlayerProps {
  id: string;
  name: string;
  position: { x: number; y: number };
  zIndex: number;
}

export function QuickTimePlayer({ id, name, position, zIndex }: QuickTimePlayerProps) {
  const { bringToFront } = useAppContext();
  const [isPaused, setIsPaused] = useState(true);
  
  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };
  
  return (
    <MacWindow
      title={name}
      width="w-[500px]"
      height="h-[400px]"
      defaultPosition={position}
      zIndex={zIndex}
      onFocus={() => bringToFront(id)}
      id={id}
      minWidth={320}
      minHeight={240}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 bg-gray-200 border-b border-gray-400">
          <div className="flex items-center space-x-2">
            <button 
              className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs"
              onClick={togglePlayPause}
            >
              {isPaused ? 'Play' : 'Pause'}
            </button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Stop</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Rewind</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Forward</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Volume</button>
          </div>
        </div>
        
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <div 
            className="text-white text-center absolute inset-0 flex flex-col items-center justify-center"
            style={{
              backgroundImage: "linear-gradient(to bottom, #333, #000)",
              backgroundSize: "100% 100%"
            }}
          >
            <div className="border-2 border-gray-600 rounded-full h-20 w-20 flex items-center justify-center mb-4">
              <button 
                onClick={togglePlayPause}
                className="text-white text-4xl hover:text-gray-300 focus:outline-none cursor-pointer"
              >
                {isPaused ? '▶' : '❚❚'}
              </button>
            </div>
            <p className="mb-2">QuickTime Player</p>
            <p className="text-sm mb-1">No media loaded.</p>
            <p className="text-xs text-gray-400">Resize this window by dragging the bottom-right corner</p>
          </div>
        </div>
        
        <div className="p-2 bg-gray-200 border-t border-gray-400 text-xs flex justify-between">
          <span>{isPaused ? 'Paused' : 'Playing'}</span>
          <span>00:00 / 00:00</span>
        </div>
      </div>
    </MacWindow>
  );
} 