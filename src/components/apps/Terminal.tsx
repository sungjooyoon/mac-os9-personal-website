"use client"

import { useAppContext } from '@/context/AppContext';
import { useState, useRef, useEffect } from 'react';
import { MacWindow } from '@/components/MacWindow';

interface TerminalProps {
  id: string;
  name: string;
  position: { x: number, y: number };
  zIndex: number;
}

export function Terminal({ id, name, position, zIndex }: TerminalProps) {
  const { bringToFront, minimizeApp, openApps } = useAppContext();
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 });
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Welcome to Sungjoo\'s Terminal',
    'Copyright © Sungjoo Yoon',
    'Type "help" for available commands',
    ''
  ]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [blogStep, setBlogStep] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Find this specific app in openApps to get its size
    const thisApp = openApps.find(app => app.id === id);
    if (thisApp?.size) {
      setWindowSize(thisApp.size);
    } else {
      // Use a wider fallback size
      const calculateSize = () => {
        const maxWidth = Math.min(600, window.innerWidth * 0.47);
        const maxHeight = Math.min(400, window.innerHeight * 0.37);
        setWindowSize({ 
          width: Math.round(maxWidth), 
          height: Math.round(maxHeight) 
        });
      };
      
      calculateSize();
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [id, openApps]);
  
  const handleResize = () => {
    // Only recalculate if no explicit size is set
    if (!openApps.find(app => app.id === id)?.size) {
      const maxWidth = Math.min(600, window.innerWidth * 0.47);
      const maxHeight = Math.min(400, window.innerHeight * 0.37);
      setWindowSize({ 
        width: Math.round(maxWidth), 
        height: Math.round(maxHeight) 
      });
    }
  };
  
  useEffect(() => {
    // Scroll to bottom of terminal when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleClick = () => {
    bringToFront(id);
  };
  
  const processCommand = (command: string) => {
    setTerminalHistory([...terminalHistory, `>  ${command}`]);
    
    if (loggedIn) {
      handleLoggedInCommands(command);
    } else {
      handleLoggedOutCommands(command);
    }
    
    setCurrentInput('');
  };
  
  const handleLoggedOutCommands = (command: string) => {
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'help') {
      setTerminalHistory(prev => [...prev, 
        'Available commands:',
        '  help     - Show this help message',
        '  login    - Log in to the admin console',
        '  clear    - Clear the terminal',
        '  version  - Show system version',
        ''
      ]);
    } else if (cmd === 'login') {
      setShowLoginPrompt(true);
      setTerminalHistory(prev => [...prev, 'Please enter your username:']);
    } else if (cmd === 'clear') {
      setTerminalHistory(['Terminal cleared', '']);
    } else if (cmd === 'version') {
      setTerminalHistory(prev => [...prev, 'Sungjoo\'s Terminal v1.0', '']);
    } else if (cmd === '') {
      setTerminalHistory(prev => [...prev, '']);
    } else {
      setTerminalHistory(prev => [...prev, `Command not found: ${cmd}`, '']);
    }
  };
  
  const handleLoggedInCommands = (command: string) => {
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'help') {
      setTerminalHistory(prev => [...prev, 
        'Available commands:',
        '  help     - Show this help message',
        '  logout   - Log out from the admin console',
        '  clear    - Clear the terminal',
        '  newpost  - Create a new blog post',
        '  version  - Show system version',
        ''
      ]);
    } else if (cmd === 'logout') {
      setLoggedIn(false);
      setTerminalHistory(prev => [...prev, 'Logged out successfully', '']);
    } else if (cmd === 'clear') {
      setTerminalHistory(['Terminal cleared', '']);
    } else if (cmd === 'newpost') {
      setBlogStep(1);
      setTerminalHistory(prev => [...prev, 'Creating a new blog post...', 'Enter the title:']);
    } else if (cmd === 'version') {
      setTerminalHistory(prev => [...prev, 'Sungjoo\'s Terminal v1.0 (Admin Mode)', '']);
    } else if (cmd === '') {
      setTerminalHistory(prev => [...prev, '']);
    } else {
      setTerminalHistory(prev => [...prev, `Command not found: ${cmd}`, '']);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (showLoginPrompt) {
        handleLoginProcess();
      } else if (blogStep > 0) {
        handleBlogPostProcess();
      } else {
        processCommand(currentInput);
      }
    }
  };
  
  const handleLoginProcess = () => {
    if (username === '') {
      setUsername(currentInput);
      setCurrentInput('');
      setTerminalHistory(prev => [...prev, currentInput, 'Please enter your password:']);
    } else {
      setPassword(currentInput);
      setCurrentInput('');
      
      // Simple login - in a real app, this would be more secure
      if (username === 'sungjooyoon' && password === 'opSiSbeSt$48') {
        setLoggedIn(true);
        setTerminalHistory(prev => [...prev, '*'.repeat(currentInput.length), 'Login successful! Welcome sungjooyoon.', '']);
      } else {
        setTerminalHistory(prev => [...prev, '*'.repeat(currentInput.length), 'Login failed! Incorrect username or password.', '']);
      }
      
      setShowLoginPrompt(false);
      setUsername('');
      setPassword('');
    }
  };
  
  const handleBlogPostProcess = () => {
    if (blogStep === 1) {
      setNewBlogTitle(currentInput);
      setBlogStep(2);
      setTerminalHistory(prev => [...prev, currentInput, 'Enter the content (type "end" on a new line when finished):']);
      setCurrentInput('');
    } else if (blogStep === 2) {
      if (currentInput.trim().toLowerCase() === 'end') {
        // Submit the blog post
        setBlogStep(0);
        setTerminalHistory(prev => [...prev, 'end', `New blog post "${newBlogTitle}" has been created!`, '']);
        
        // In a real app, you would save the blog post to a database here
        console.log('New blog post:', { title: newBlogTitle, content: newBlogContent });
        
        setNewBlogTitle('');
        setNewBlogContent('');
        setCurrentInput('');
      } else {
        // Continue adding to content
        setNewBlogContent(prev => prev + (prev ? '\n' : '') + currentInput);
        setTerminalHistory(prev => [...prev, currentInput]);
        setCurrentInput('');
      }
    }
  };

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
          maxWidth: 'calc(100vw - 160px)',
          maxHeight: 'calc(100vh - 150px)'
        }}
        isActive={true}
      >
        <div 
          className="bg-black text-green-500 p-2 h-full overflow-auto"
          ref={terminalRef}
          style={{ 
            fontFamily: 'var(--mac-font)', 
            fontSize: '12px'
          }}
        >
          {terminalHistory.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
          
          <div className="flex">
            {!showLoginPrompt && blogStep === 0 && <span>{'>  '}</span>}
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-black text-green-500 outline-none border-none flex-1"
              autoFocus
              style={{ 
                caretColor: 'green',
                fontFamily: 'var(--mac-font)', 
                fontSize: '12px'
              }}
            />
          </div>
        </div>
      </MacWindow>
    </div>
  );
} 