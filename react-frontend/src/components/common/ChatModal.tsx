import React, { useState } from 'react';
import { RefreshCw, MessageSquareDashed, Plus, ArrowUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChatModalProps {
  onClose?: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');

  return (
    <div className="w-[400px] h-[550px] flex flex-col bg-white shadow-xl rounded-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-start p-5 pb-4 border-b">
        <div>
          <h2 className="text-[17px] font-medium text-gray-900 leading-none mb-2">New Chat</h2>
          <p className="text-[13px] text-gray-500">How can I help you today?</p>
        </div>
        <button className="h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-4">
        <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center mb-2">
          <MessageSquareDashed size={24} className="text-gray-900" />
        </div>
        
        <h3 className="text-xl font-medium text-gray-900 tracking-tight">Morning, shadcn!</h3>
        
        <p className="text-[14px] text-gray-500 max-w-[280px] leading-relaxed">
          What are we working on today? Press send to start a new conversation
        </p>
      </div>

      {/* Footer / Input Area */}
      <div className="p-4">
        <div className="bg-gray-100/70 rounded-md p-3 flex items-end gap-3 transition-colors focus-within:bg-gray-100/90">
          <button className="shrink-0 h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-700 transition-colors">
            <Plus size={18} />
          </button>
          
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI..."
            className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] text-gray-800 placeholder:text-gray-500 min-h-[44px] max-h-[120px] py-1"
            rows={2}
          />
          
          <button 
            className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${ message.trim() ?'bg-blue-600 hover:bg-blue-700 text-white shadow-md':'bg-blue-600 text-white'}`}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
