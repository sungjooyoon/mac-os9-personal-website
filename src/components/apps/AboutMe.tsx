"use client"

import { useAppContext } from '@/context/AppContext';
import { useState, useRef, useEffect } from 'react';
import { MacWindow } from '@/components/MacWindow';

interface AboutMeProps {
  id: string;
  name: string;
  position: { x: number, y: number };
  zIndex: number;
}

export function AboutMe({ id, name, position, zIndex }: AboutMeProps) {
  const { closeApp, bringToFront, minimizeApp, openApps } = useAppContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 450, height: 400 });
  
  // Use size from the app context if available
  useEffect(() => {
    // Find this specific app in openApps to get its size
    const thisApp = openApps.find(app => app.id === id);
    if (thisApp?.size) {
      setWindowSize(thisApp.size);
    } else {
      // Fallback to calculated size
      const calculateSize = () => {
        const width = Math.min(600, Math.max(500, window.innerWidth * 0.45));
        const height = Math.min(600, Math.max(500, window.innerHeight * 0.7));
        setWindowSize({ width, height });
      };
      
      calculateSize();
    }
    
    // Add resize listener for responsive adjustments
    const handleResize = () => {
      // Only recalculate if no explicit size is set
      if (!openApps.find(app => app.id === id)?.size) {
        const width = Math.min(600, Math.max(500, window.innerWidth * 0.45));
        const height = Math.min(600, Math.max(500, window.innerHeight * 0.7));
        setWindowSize({ width, height });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [id, openApps]);

  // Function to make window bigger
  const makeWindowBigger = () => {
    // Calculate ~90% of window size for maximized view
    const maxWidth = Math.round(window.innerWidth * 0.9);
    const maxHeight = Math.round(window.innerHeight * 0.9);
    
    setWindowSize({ width: maxWidth, height: maxHeight });
  };

  // Function to make window smaller
  const makeWindowSmaller = () => {
    minimizeApp(id);
  };

  const handleClose = () => {
    closeApp(id);
  };

  const handleClick = () => {
    bringToFront(id);
  };

  // Position at top-left with room for desktop elements
  const windowPosition = {
    x: 30,
    y: 40
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* External control buttons */}
      <div style={{ position: 'absolute', top: '-18px', right: '50%', zIndex: 99999, display: 'flex', gap: '4px' }}>
        <button 
          onClick={makeWindowBigger}
          style={{ 
            width: '12px', 
            height: '12px', 
            background: '#28c941', 
            border: '1px solid #14ae2c',
            borderRadius: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#006400',
            cursor: 'pointer',
            lineHeight: '10px',
            padding: 0,
            textAlign: 'center'
          }}
        >
          <span style={{ marginLeft: '0.5px', marginTop: '-0.5px' }}>+</span>
        </button>
        <button 
          onClick={makeWindowSmaller}
          style={{ 
            width: '12px', 
            height: '12px', 
            background: '#ffbd2e', 
            border: '1px solid #e09e1a',
            borderRadius: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#985700',
            cursor: 'pointer',
            lineHeight: '11px',
            padding: 0
          }}
        >
          −
        </button>
      </div>
      
      <MacWindow
        id={id}
        title={name}
        defaultPosition={position}
        zIndex={zIndex}
        onFocus={handleClick}
        customStyles={{
          width: `${windowSize.width}px`,
          height: `${windowSize.height}px`,
          maxWidth: 'calc(100vw - 160px)', // Leave space for icons
          maxHeight: 'calc(100vh - 150px)'  // Space above dock
        }}
        isActive={true}
      >
        <div 
          className="p-4 h-full overflow-auto"
          ref={contentRef}
        >
          <div>
            <h2 className="text-xl mb-4">Hello, I&apos;m Sungjoo.</h2>
            
            <p className="mb-3" style={{ 
              fontFamily: 'Monaco, monospace', 
              fontSize: '12.5px', 
              WebkitFontSmoothing: 'none',
              fontSmooth: 'never',
              letterSpacing: '-0.2px'
            }}>
              <span style={{ display: 'inline-block', textIndent: '0px' }}>
                <strong>Currently on voluntary leave from Harvard to build Biography as our founding CEO.</strong> Most recently, we raised an oversubscribed pre-seed round with ~$1.1m in investment offers. Reach out to sungjoo@biography.industries with related inquiries.
              </span>
            </p>
            
            <p className="mb-3" style={{ 
              fontFamily: 'Monaco, monospace', 
              fontSize: '12.5px', 
              WebkitFontSmoothing: 'none',
              fontSmooth: 'never',
              letterSpacing: '-0.2px'
            }}>
              Above all else, I care about building fun and useful things.
            </p>
            
            <p className="mb-3" style={{ 
              fontFamily: 'Monaco, monospace', 
              fontSize: '12.5px', 
              WebkitFontSmoothing: 'none',
              fontSmooth: 'never',
              letterSpacing: '-0.2px'
            }}>
              Other hats I&apos;ve worn in the past: American national (2022) and world (2023) debate champion. Brief stints in competitive math. Previously a speechwriter to Dem. leadership in the U.S. House. Youngest journalist to ever write the New York Times&apos; headline op-ed, and a fmr. intern columnist at the Los Angeles Times. Dabbling here and there in white-hat hacking. <strong>If you&apos;d like to learn more, please visit my LinkedIn and/or Github (accessible through the pear-icon drop-down in the top left corner).</strong>
            </p>
            
            <p className="mb-3" style={{ 
              fontFamily: 'Monaco, monospace', 
              fontSize: '12.5px', 
              WebkitFontSmoothing: 'none',
              fontSmooth: 'never',
              letterSpacing: '-0.2px'
            }}>
              For non-Biography related inquiries, please contact me at sungjooyoon@college.harvard.edu (both sungjoo.yoon@latimes.com and sungjoo.yoonca@mail.house.gov are now out of commission).
            </p>
            
            <p className="mb-2" style={{ 
              fontFamily: 'Monaco, monospace', 
              fontSize: '12.5px', 
              WebkitFontSmoothing: 'none',
              fontSmooth: 'never',
              letterSpacing: '-0.2px'
            }}>
              Other things I&apos;m interested in:
            </p>
            
            <ul className="list-none pl-4 mb-3" style={{ 
              fontFamily: 'Monaco, monospace', 
              fontSize: '12.5px', 
              WebkitFontSmoothing: 'none',
              fontSmooth: 'never',
              letterSpacing: '-0.2px'
            }}>
              <li className="mb-1">—virtue ethics as an ethical framework</li>
              <li className="mb-1">—(Old) K*nye, A$AP Rocky, the Strokes, and Mac DeMarco</li>
              <li className="mb-1">—neuroeconomics (my post-career goal is to pursue a Social & Decision Neuroscience PhD at Caltech, which was the lab I worked at last summer)</li>
              <li className="mb-1">—photography (which was one of my two jobs before I dropped out)</li>
              <li className="mb-1">—Anthony Bourdain</li>
            </ul>
          </div>
        </div>
      </MacWindow>
    </div>
  );
} 