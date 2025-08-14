import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatMessage from './components/ChatMessage';

function App() {
  const [messages, setMessages] = useState([]);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const messagesContainerRef = useRef(null);
  const eventSourceRef = useRef(null);
  const timeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isNearBottomRef = useRef(true);

  const checkIfNearBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 250;
      
      // Hide indicator if user scrolls to bottom manually
      if (isNearBottomRef.current && showScrollIndicator) {
        setShowScrollIndicator(false);
      }
    }
  }, [showScrollIndicator]);

  const scrollToBottomImmediate = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);
  
  const scrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesContainerRef.current && isNearBottomRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);
  
  const handleScrollToBottomClick = useCallback(() => {
    // Set flag to true to enable auto-scroll
    isNearBottomRef.current = true;
    // Hide the indicator
    setShowScrollIndicator(false);
    // Scroll to bottom immediately
    scrollToBottomImmediate();
  }, [scrollToBottomImmediate]);

  useEffect(() => {
    const createEventSource = () => {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
      const eventSource = new EventSource(`${apiBaseUrl}/events`);

      const resetTimeout = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          console.log('No messages received for 10 seconds, reconnecting...');
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
          eventSourceRef.current = createEventSource();
        }, 10000);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages(prevMessages => [...prevMessages, data].slice(-100));
        resetTimeout();
        
        // Show indicator if user is not at bottom when new message arrives
        if (!isNearBottomRef.current) {
          setShowScrollIndicator(true);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        setTimeout(() => {
          console.log('Reconnecting after error...');
          eventSourceRef.current = createEventSource();
        }, 1000);
      };

      eventSource.onopen = () => {
        console.log('SSE connection established');
        resetTimeout();
      };

      return eventSource;
    };

    eventSourceRef.current = createEventSource();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);
  
  // Auto-scroll is now handled only when images load, not on message arrival

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      <div className="flex-1 container mx-auto px-2 py-2 sm:px-4 sm:py-4 max-w-4xl flex flex-col min-h-0">
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 shadow-md border-b border-gray-700">
            <h1 className="text-xl sm:text-2xl font-light text-white">
              Cat Chat 😺💕
            </h1>
          </div>
          
          <div className="relative flex-1 min-h-0">
            <div 
              ref={messagesContainerRef} 
              className="bg-gray-50 h-full overflow-y-auto pt-1 px-3 pb-3 sm:px-4 sm:pb-4 -webkit-overflow-scrolling-touch"
              onScroll={checkIfNearBottom}
            >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 mt-4 font-medium">Awaiting messages...</p>
                <p className="text-gray-400 text-sm mt-1">Stream will start automatically</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    data={message} 
                    onImageLoad={scrollToBottom}
                  />
                ))}
              </div>
            )}
            </div>
            
            {showScrollIndicator && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <button
                  onClick={handleScrollToBottomClick}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 pointer-events-auto"
                  aria-label="Scroll to bottom"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">New messages</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-gray-100 border-t border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Receive-only mode"
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed opacity-75 text-sm sm:text-base"
                disabled
              />
              <div className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-800 text-white rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;