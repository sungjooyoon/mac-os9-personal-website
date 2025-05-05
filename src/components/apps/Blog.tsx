"use client"

import { useAppContext } from '@/context/AppContext';
import { useState, useRef, useEffect } from 'react';
import { MacWindow } from '@/components/MacWindow';

interface BlogProps {
  id: string;
  name: string;
  position: { x: number, y: number };
  zIndex: number;
}

export function Blog({ id, name, position, zIndex }: BlogProps) {
  const { bringToFront, minimizeApp, openApps } = useAppContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 450, height: 400 });
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  
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

  const handleClick = () => {
    bringToFront(id);
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

  // Blog posts
  const blogPosts = [
    {
      id: 1,
      title: "Biography's short-form thesis",
      subtitle: "Who we are, what we do...",
      date: "April 27, 2025",
      isPinned: true,
      content: `We are an early-stage startup/development lab focused on building out a suite of consumer AI applications and agents.

Our technical thesis is in our name: "bio" as in humans and people, "graphy" as in graphing algorithms which relate those people. Simply put, we are quite interested in data on human relationships. By treating every person in a given community as a node, every edge between nodes as proximity metrics, and seeding the resulting graph with existing data on real-life connections, we think we can create a 1:1 representation of human relationships in the cloud.

<strong>In turn, we will become the first company to have such a comprehensive schema—of physical relations in digital form. For any given person, we know which social circles they exist in, and which people matter to them. We think that maintaining such a system of record would be a profound contribution to humanity, technological progress, and computing.</strong>

<strong>In the short-term, think of how insanely efficient this makes consumer applications.</strong>

Imagine a serendipity engine where we can subtly manufacture real-world collisions between mutuals. Imagine that we could dynamically generate weekly run clubs with only friends of friends. Like real-life social media, with streams of physical interactions as opposed to digital fragments of others' lives.

Or, imagine that instead of dating apps filled with strangers, we could apply the double opt-in data escrow among second-degree connections, and deliver it to users through the form factor of an iMessage agent.

Remember Pokemon Go and similar augmented reality games? It sucked that you couldn't battle other users, because of safety concerns. But imagine we knew who was demographically similar and mutually safe, and we could enable battle just among those friends of friends.

Even imagine a world where advertising targets not by matrices of loose keywords and engagement patterns alone, but by targeting all ten members of a friend group, to manufacture a hyperlocal collective unconscious.

The upshot is simple. This data is invaluable and no one has it yet. That is Biography's mission—to compile that data, and build incredible consumer products on top of it.

<strong>In the long-term, this positions us to win the trillion-dollar AI assistant market as well.</strong>

Current AI assistants/secretaries/personal agents focus on automating administrative tasks—responding to emails, answering texts, etc. But they have awfully low adoption because of the low-effort, high-leverage nature inherent to administration. Take emails, for example. They may be annoying but only take a minute or two to write; they are low-effort. But they are high-leverage, meaning that the material and professional consequences of messing them up are significant. Your boss or professor would feel pretty offended if your AI assistant messed up an email to them, and they realized that you sent said AI assistant to communicate with them.

Bottom line—low-effort tasks are not a significant-enough inconvenience to trigger consumer demand. High-leverage tasks have consequences that further prevent user acquisition. They are tasks where even a 3-5% hallucination rate of the foundational model results in an unacceptable magnitude of error. But eventually, the foundational models will mitigate such errors to near-zero.

<strong>When that happens, the winners of the AI assistant market will not have been those who have automated administrative (low-effort, high leverage) tasks.</strong>

Those abilities will exist inherent to the models, and no one will have a defensible moat on those tasks.

The winners will be those who have automated the widest suite of high-effort, low leverage tasks (i.e. everything else). Tasks that are genuinely difficult to complete by oneself, but have inconsequential failures and therefore high fault tolerance. Take the problem of romantic matchmaking. Setting up a date in real life comes with real inconveniences—the risk of rejection, stirring drama within social circles, having to ascertain information, and so on. They are also low leverage. There are not many material or professional consequences to not going on a date with someone, though it is a nice addition to one's life.

We want to build all of these high-effort, low-leverage applications, because we know that when everyone can automate email perfectly using GPT o10, consumers will flock to the suite of assistants that can do everything else as well.

<strong>What are we doing that no one else is?</strong>

One observation is that a lot of these high-effort, low leverage tasks are social tasks. There are two conjectures which drive this.

First, social tasks are broadly input-dense. Determining how to navigate a social environment requires data which is magnitudes more granular than factual or historic knowledge. It requires context that is hyperlocal, personal, and constantly evolving; information that is almost never formally recorded. And since human cognition is merely an offshoot of symbolic processing, we find input-dense environments as higher-effort than input-light environments.

Social tasks are no exception to this pattern, and are therefore definitionally high-effort in most cases. Administrative tasks, on the contrary, are input-light and require a simple application of syntax + a few facts to reach a highly-probabilistic conclusion. Therefore, they remain low-effort.

Second, social tasks usually have less material consequence attached to them. Failing to complete a work deliverable can get you fired. Failing to catch up with a friend is not so bad, because in most cases interpersonal faults do not turn you homeless. Therefore, social tasks are broadly low leverage.

However, no one is able to effectively build automations for social tasks.

This is because automation of social tasks requires social data. But because this data is so fragmented and hard to model, almost no one is attempting to systematize it at scale. Most consumer AI efforts today focus on administrative tasks—emails, scheduling, summarization—because those tasks rely on structured, publicly available information. They are low-hanging fruit.

<strong>But as always, the real alpha lies in the work no one else wants to do. We are here to do that work.</strong>

By building our dynamic database of human relationships, we will be the first with the social data to create those socially-relevant automations. Eventually, we want everyone to have a Biography-branded executive assistant. We want those assistants to be network-aware, connecting across social and professional graphs. Those assistants will be able to communicate with each other, and optimize every aspect of one's life—from low-effort, high leverage emails all the way down to high-effort, low leverage socialization. They will even be able to infer social information, as each assistant begins to mirror a biography of one human's life.

<strong>Finally, in the long-term, we want to play in the realm of pure data as well.</strong>

We think that maintaining the first system of record of this type positions us well for the era of AGI, and the impending explosion in scientific advancement. I would point out two additional use cases of such a system.

First, foundational models will need our data to better predict and generate any results related to large-scale socialization. Second, multi-agent simulation models will need our data to most accurately predict how information disperses throughout society. We intend to be the canonical providers of those structured, high-fidelity social graphs.

<strong>We are looking for a team of only the most brilliant people to join us. If you are reading this, that may apply to you.</strong>

<strong>sjy, 04.27.25</strong>`
    }
  ];

  // Function to go back to the post list
  const backToList = () => {
    setSelectedPost(null);
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = document.createElement('div');
    const currentPost = blogPosts.find(post => post.id === selectedPost);
    
    if (!currentPost) return;
    
    // Create a styled version of the content for printing
    printContent.innerHTML = `
      <html>
        <head>
          <title>${currentPost.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              line-height: 1.6;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 8px;
            }
            .subtitle {
              font-style: italic;
              color: #666;
              margin-bottom: 24px;
            }
            .date {
              margin-bottom: 32px;
              color: #555;
              font-size: 14px;
            }
            .content {
              font-size: 14px;
            }
            p {
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <h1>${currentPost.title}</h1>
          ${currentPost.subtitle ? `<div class="subtitle">${currentPost.subtitle}</div>` : ''}
          <div class="date">Published: ${currentPost.date}</div>
          <div class="content">
            ${currentPost.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      printWindow.focus();
      // Slight delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
        // Close the window after print dialog is closed (or allow user to keep it open)
      }, 300);
    }
  };
  
  // Share functionality
  const handleShare = () => {
    const currentPost = blogPosts.find(post => post.id === selectedPost);
    if (!currentPost) return;
    
    // Create share text with title and metadata
    const shareText = `${currentPost.title}\n${currentPost.subtitle || ''}\nPublished: ${currentPost.date}\n\nShared from Sungjoo's Blog`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      // Show notification
      setShowNotification(true);
      
      // Hide notification after 2 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    });
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
          className="h-full overflow-auto"
          ref={contentRef}
        >
          {/* Navigation toolbar */}
          <div className="bg-gray-200 border-b border-gray-400 p-2 flex items-center" style={{ height: '32px' }}>
            <div style={{ width: '60px', textAlign: 'left' }}>
              {selectedPost !== null && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedPost(null);
                  }} 
                  className="px-1.5 py-0.5 text-xs bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-100 z-10"
                  style={{ fontSize: '10px' }}
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex-1 text-center font-bold text-sm">
              Sungjoo&apos;s Blog
            </div>
            <div style={{ width: '60px' }}></div>
          </div>
          
          {/* Address bar */}
          <div className="bg-gray-100 border-b border-gray-400 p-2 flex items-center">
            <span className="text-xs mr-2" style={{ paddingLeft: '2px' }}>File:</span>
            <div className="flex-1 bg-white border border-gray-400 px-2 py-1 text-xs rounded">
              {selectedPost !== null 
                ? `users/sungjooyoon/blog/${blogPosts.find(post => post.id === selectedPost)?.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}` 
                : 'users/sungjooyoon/blog'}
            </div>
          </div>
          
          {selectedPost === null ? (
            // Blog post list
            <div className="p-4" style={{ backgroundColor: '#f6eee3' }}>
              <h2 className="text-xl mb-2 font-bold border-b-2 border-gray-300 pb-2">Blog posts, thoughts, rambles</h2>
              
              {blogPosts.map(post => (
                <div 
                  key={post.id} 
                  className="mb-5 pb-4 border-b border-gray-200 cursor-pointer p-2 rounded transition-colors"
                  onClick={() => setSelectedPost(post.id)}
                  style={{ backgroundColor: '#f6eee3' }}
                >
                  {post.isPinned && (
                    <div className="flex items-center mb-1 text-gray-500" style={{ fontFamily: 'var(--mac-font)', fontSize: '10px' }}>
                      <img 
                        src="/assets/pushpin.svg" 
                        alt="Pinned" 
                        className="w-3 h-3 mr-1 opacity-70"
                        style={{ display: 'inline-block' }}
                      />
                      <span>PINNED</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-bold text-blue-800">{post.title}</h3>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{post.date}</span>
                  </div>
                  {post.subtitle && (
                    <p className="text-sm text-gray-700 italic mb-2">{post.subtitle}</p>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-3" style={{ 
                    fontFamily: 'Monaco, monospace', 
                    fontSize: '12px', 
                    WebkitFontSmoothing: 'none',
                    fontSmooth: 'never',
                    letterSpacing: '-0.2px'
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content.substring(0, 180) + '...' }}
                  >
                  </p>
                  <button 
                    className="mt-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded border border-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post.id);
                    }}
                  >
                    Read more →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Single blog post view
            <div className="p-5" style={{ backgroundColor: '#f6eee3' }}>
              {blogPosts.filter(post => post.id === selectedPost).map(post => (
                <div key={post.id} style={{ backgroundColor: '#f6eee3', padding: '20px', borderRadius: '4px' }}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b-2 border-gray-200 pb-2">{post.title}</h2>
                  {post.subtitle && (
                    <div className="text-lg text-gray-700 italic mb-4">{post.subtitle}</div>
                  )}
                  <div className="mb-4 px-3 py-2 text-sm text-gray-600 rounded" style={{ backgroundColor: '#ede2d5' }}>
                    <span className="font-semibold">Published:</span> {post.date}
                  </div>
                  <div className="leading-relaxed space-y-4" style={{ 
                    fontFamily: 'Monaco, monospace', 
                    fontSize: '12px', 
                    WebkitFontSmoothing: 'none',
                    fontSmooth: 'never',
                    letterSpacing: '-0.2px',
                    lineHeight: 1.6
                  }}>
                    {post.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4" dangerouslySetInnerHTML={{ __html: paragraph }}></p>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedPost(null);
                      }} 
                      className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                    >
                      ← Back to all posts
                    </button>
                    <div className="flex space-x-2">
                      <button 
                        className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded border border-blue-200"
                        onClick={handleShare}
                      >
                        Share
                      </button>
                      <button 
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded border border-gray-200"
                        onClick={handlePrint}
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Clipboard notification - Mac OS 9 style */}
          {showNotification && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-700 shadow-lg p-4 min-w-60 text-center"
              style={{
                fontFamily: 'Chicago, monospace',
                fontSize: '12px',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
                zIndex: 1000
              }}
            >
              <div className="flex flex-col items-center">
                <div className="mb-2 font-bold">Note</div>
                <div className="border-t border-gray-300 w-full my-1"></div>
                <div className="py-2">Post details copied to clipboard.</div>
                <button
                  className="mt-2 px-4 py-1 border border-gray-400 bg-gray-200 rounded text-xs"
                  onClick={() => setShowNotification(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </MacWindow>
    </div>
  );
} 