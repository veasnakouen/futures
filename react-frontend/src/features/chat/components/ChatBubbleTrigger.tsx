import React from "react";
import { MessageCircle } from "lucide-react";

interface ChatBubbleTriggerProps {
  totalUnread: number;
  onOpen: () => void;
}

export const ChatBubbleTrigger: React.FC<ChatBubbleTriggerProps> = ({
  totalUnread,
  onOpen,
}) => {
  return (
    <div className="relative group cursor-grab active:cursor-grabbing">
      {totalUnread > 0 && (
        <div className="absolute -top-1 -right-1 z-10">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 text-white text-[10px] font-black items-center justify-center border-2 border-white">
              {totalUnread}
            </span>
          </span>
        </div>
      )}
      <button
        onClick={onOpen}
        className="p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 cursor-grab active:cursor-grabbing"
        title="Drag to move chat bubble anywhere"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default ChatBubbleTrigger;
