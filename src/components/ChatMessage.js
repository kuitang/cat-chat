import React from 'react';

function ChatMessage({ data, onImageLoad }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                  <p className="text-gray-800 font-medium leading-relaxed">{data.message}</p>
                </div>
                
                {data.image && (
                  <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                    <img 
                      src={data.image} 
                      alt="Event content" 
                      className="rounded-md w-full max-w-md object-cover shadow-sm"
                      onLoad={onImageLoad}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        if (onImageLoad) onImageLoad();
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-gray-500 font-medium">
                    {formatTimestamp(data.timestamp)}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Event ID: {data.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;