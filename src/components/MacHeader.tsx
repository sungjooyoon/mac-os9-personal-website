"use client"

import { useState, useEffect, useRef } from 'react'

export function MacHeader() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      
      setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to reload the page
  const reloadPage = () => {
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAppleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apple menu items
  const appleMenuItems = [
    { label: "Sungjoo's LinkedIn", url: "https://www.linkedin.com/in/sjnyoon/" },
    { label: "Sungjoo's GitHub", url: "https://github.com/sungjooyoon" },
  ];
  
  return (
    <div className="mac-menu-bar sticky top-0 flex items-center justify-between z-50">
      <div className="flex items-center h-full">
        <div 
          className="mac-apple-menu-item h-full flex items-center relative"
          ref={dropdownRef}
        >
          {/* Pear icon with dropdown toggle */}
          <div 
            className={`w-[18px] h-[14px] mx-1 flex items-center justify-center cursor-pointer ${showAppleMenu ? 'bg-black bg-opacity-20' : ''}`}
            onClick={() => setShowAppleMenu(!showAppleMenu)}
            style={{
              padding: '0 2px'
            }}
          >
            <img 
              src="/images/pear1.png" 
              alt="Pear" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Apple Menu Dropdown */}
          {showAppleMenu && (
            <div 
              className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-700 shadow-lg"
              style={{
                fontFamily: 'Chicago, monospace',
                fontSize: '12px',
                borderRadius: '0',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
              }}
            >
              {appleMenuItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-1 hover:bg-black hover:bg-opacity-10 border-b border-gray-200 last:border-0"
                  style={{ 
                    paddingTop: '2px', 
                    paddingBottom: '2px',
                    fontWeight: 'bold'
                  }}
                  onClick={() => setShowAppleMenu(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div 
          className="mac-menu-item font-bold text-sm px-2 cursor-pointer hover:bg-black hover:bg-opacity-10"
          onClick={reloadPage}
        >
          Sungjoo&apos;s Website
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="mr-4 text-sm font-bold">
          {currentTime}
        </div>
      </div>
    </div>
  )
} 