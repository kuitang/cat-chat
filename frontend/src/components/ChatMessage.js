import React from 'react';

function ChatMessage({ data, onImageLoad }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="group">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
              <p className="text-gray-800 leading-relaxed">{data.message}</p>
            </div>
            
            {data.image && (
              <div className="border-t border-gray-100 p-3 bg-gray-50">
                <img 
                  src={data.image} 
                  alt="Stream content" 
                  className="rounded-md max-w-full h-auto shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  onLoad={onImageLoad}
                  onError={(e) => {
                    e.target.onerror = null;
                    const parent = e.target.parentElement;
                    parent.innerHTML = '<div className="text-gray-400 text-sm italic p-4 bg-gray-100 rounded">Image failed to load</div>';
                    if (onImageLoad) onImageLoad();
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 px-1">
            <span className="text-xs text-gray-500">
              {formatTimestamp(data.timestamp)}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400 font-mono">
              ID: {new Date(data.timestamp).getTime()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;