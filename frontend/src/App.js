import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatMessage from './components/ChatMessage';

function App() {
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const eventSourceRef = useRef(null);
  const timeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isNearBottomRef = useRef(true);

  const checkIfNearBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesContainerRef.current && isNearBottomRef.current) {
        const lastMessage = messagesContainerRef.current.lastElementChild;
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    }, 100);
  }, []);

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

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      <div className="flex-1 container mx-auto px-2 py-2 sm:px-4 sm:py-4 max-w-4xl flex flex-col min-h-0">
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3">
            <h1 className="text-xl sm:text-2xl font-light text-white">
              Cat Chat 😺💕
            </h1>
          </div>
          
          <div 
            ref={messagesContainerRef} 
            className="bg-gray-50 flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 -webkit-overflow-scrolling-touch"
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