"use client"

import { useAppContext } from '@/context/AppContext';
import { MacWindow } from '@/components/MacWindow';

interface AboutComputerProps {
  id: string;
  name: string;
  position: { x: number, y: number };
  zIndex: number;
}

export function AboutComputer({ id, position, zIndex }: AboutComputerProps) {
  const { bringToFront } = useAppContext();
  
  return (
    <MacWindow
      title="About This Computer"
      width="w-[400px]"
      height="h-[310px]"
      defaultPosition={position}
      zIndex={zIndex}
      onFocus={() => bringToFront(id)}
      id={id}
      minWidth={400}
      minHeight={310}
    >
      <div className="p-4 flex flex-col h-full bg-white">
        <div className="flex border-b border-gray-300 pb-3">
          <div className="mr-4">
            <div className="w-28 h-28 relative bg-blue-400 rounded-md flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl">😊</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold">Mac OS 9</h2>
            <p className="text-sm mt-1">The Best Internet Operating System Ever</p>
          </div>
        </div>
        
        <div className="mt-4 text-sm">
          <div className="mb-1 flex">
            <span className="w-32 font-bold">Version:</span>
            <span>Mac OS 9</span>
          </div>
          <div className="mb-1 flex">
            <span className="w-32 font-bold">Built-in Memory:</span>
            <span>96 MB</span>
          </div>
          <div className="mb-1 flex">
            <span className="w-32 font-bold">Virtual Memory:</span>
            <span>282 MB</span>
          </div>
          <div className="mb-1 flex">
            <span className="w-32 font-bold">Largest Unused Block:</span>
            <span>147 MB</span>
          </div>
          <div className="mb-1 border-t border-gray-300 pt-2 mt-4">
            <div className="flex">
              <span className="w-32 font-bold">Total Disk Space:</span>
              <span>3065 MB</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold">Free Disk Space:</span>
              <span>701 MB</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto text-[10px] text-right text-gray-500">
          ™ & © Michael Mallory, 1996-2000
        </div>
      </div>
    </MacWindow>
  );
} 