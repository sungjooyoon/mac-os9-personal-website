"use client"

import { useAppContext } from '@/context/AppContext';
import { AboutMe } from '@/components/apps/AboutMe';
import { Blog } from '@/components/apps/Blog';
import { Terminal } from '@/components/apps/Terminal';

export function OpenApps() {
  const { openApps } = useAppContext();
  
  return (
    <>
      {openApps.map(app => {
        if (app.type === 'aboutme') {
          return (
            <AboutMe
              key={app.id}
              id={app.id}
              name={app.name}
              position={app.position}
              zIndex={app.zIndex}
            />
          );
        }
        
        if (app.type === 'blog') {
          return (
            <Blog
              key={app.id}
              id={app.id}
              name={app.name}
              position={app.position}
              zIndex={app.zIndex}
            />
          );
        }
        
        if (app.type === 'terminal') {
          return (
            <Terminal
              key={app.id}
              id={app.id}
              name={app.name}
              position={app.position}
              zIndex={app.zIndex}
            />
          );
        }
        
        return null;
      })}
    </>
  );
} 