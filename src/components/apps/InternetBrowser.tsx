"use client"

import { MacWindow } from '@/components/MacWindow';
import { useAppContext } from '@/context/AppContext';

interface InternetBrowserProps {
  id: string;
  name: string;
  position: { x: number; y: number };
  zIndex: number;
}

export function InternetBrowser({ id, name, position, zIndex }: InternetBrowserProps) {
  const { bringToFront, closeApp } = useAppContext();
  
  return (
    <MacWindow
      title={name}
      width="w-[600px]"
      height="h-[400px]"
      defaultPosition={position}
      zIndex={zIndex}
      onFocus={() => bringToFront(id)}
      id={id}
      minWidth={350}
      minHeight={250}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 bg-gray-200 border-b border-gray-400">
          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Back</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Forward</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Stop</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Refresh</button>
            <button className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Home</button>
          </div>
          <button onClick={() => closeApp(id)} className="px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Close</button>
        </div>
        
        <div className="p-2 border-b border-gray-400 bg-white">
          <div className="flex items-center">
            <span className="mr-2 text-xs">Address:</span>
            <input 
              type="text" 
              className="flex-1 px-2 py-1 text-xs border border-gray-400 bg-white" 
              value="http://www.apple.com/" 
              readOnly
            />
            <button className="ml-2 px-2 py-1 bg-gray-300 border border-gray-400 text-xs">Go</button>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-4 overflow-auto">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-800 rounded-full">
              <span className="text-white text-2xl">🍎</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Welcome to Apple.com</h2>
            <p className="text-center text-sm mb-4">
              This is a simulated browser window. Resize this window by dragging the bottom-right corner!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border border-gray-300 p-3 rounded text-center">
                  <div className="mb-2 bg-gray-100 p-2 rounded">
                    Product {item}
                  </div>
                  <p className="text-xs">Item description here</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-2 bg-gray-200 border-t border-gray-400 text-xs flex justify-between">
          <span>Done</span>
          <span>Resizable window</span>
        </div>
      </div>
    </MacWindow>
  );
} 