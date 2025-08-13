import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';

function App() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Wait for DOM to update with new message before scrolling
    setTimeout(scrollToBottom, 0);
  }, [messages]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, data]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Real-Time Event Stream
          </h1>
          <p className="text-gray-600 mt-2">Server-Sent Events Demonstration</p>
        </div>
        
        <div ref={messagesContainerRef} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px] max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">Waiting for events...</p>
              <p className="text-sm mt-1">Messages will appear here automatically</p>
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
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Read-only mode - receiving server events"
                className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-500 cursor-not-allowed font-medium"
                disabled
              />
            </div>
            <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md text-sm font-medium">
              SSE Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;