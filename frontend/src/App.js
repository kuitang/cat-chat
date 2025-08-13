import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';

function App() {
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    const eventSource = new EventSource(`${apiBaseUrl}/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, data].slice(-100));
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
            <h1 className="text-2xl font-light text-white">
              Cat Chat 😺💕
            </h1>
            <p className="text-gray-400 text-sm mt-1">Real-time message streaming</p>
          </div>
          
          <div 
            ref={messagesContainerRef} 
            className="bg-gray-50 h-[600px] overflow-y-auto p-6"
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
          
          <div className="bg-gray-100 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Receive-only mode"
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed opacity-75"
                disabled
              />
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;