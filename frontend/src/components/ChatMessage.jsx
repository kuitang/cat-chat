import React from 'react';

function ChatMessage({ data, onImageLoad }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const catEmojis = ['🐱', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐈', '🐈‍⬛'];
  const randomCat = catEmojis[Math.floor(Math.random() * catEmojis.length)];

  return (
    <div className="group">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-sm text-lg">
            {randomCat}
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
              <p className="text-gray-800 leading-relaxed">{data.message}</p>
            </div>
            
            {data.image && (
              <div className="border-t border-gray-100 p-3 bg-gray-50">
                <div className="relative" style={{ maxHeight: '50vh', overflow: 'hidden' }}>
                  <img 
                    src={data.image} 
                    alt="Stream content" 
                    className="rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
                    style={{ maxHeight: '50vh', width: 'auto', objectFit: 'contain' }}
                    onLoad={onImageLoad}
                    onError={(e) => {
                      e.target.onerror = null;
                      const parent = e.target.parentElement.parentElement;
                      parent.innerHTML = '<div className="text-gray-400 text-sm italic p-4 bg-gray-100 rounded">Image failed to load</div>';
                      if (onImageLoad) onImageLoad();
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 px-1">
            <span className="text-xs text-gray-500">
              {formatTimestamp(data.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;