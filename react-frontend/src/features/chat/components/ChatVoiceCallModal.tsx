import React from "react";
import { Phone, PhoneOff } from "lucide-react";
import { Avatar } from '@/lib/flowbite-compat';

interface ChatVoiceCallModalProps {
  incomingCall: string;
  onAccept: () => void;
  onReject: () => void;
}

export const ChatVoiceCallModal: React.FC<ChatVoiceCallModalProps> = ({
  incomingCall,
  onAccept,
  onReject,
}) => {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[90vw] max-w-sm bg-white dark:bg-gray-800 p-8 rounded-md shadow-2xl border-4 border-blue-500 animate-in zoom-in-95 duration-300 flex flex-col items-center gap-6">
      <div className="relative">
        <Avatar
          placeholderInitials={incomingCall.substring(0, 2).toUpperCase()}
          rounded
          size="xl"
          className="ring-4 ring-blue-500/20"
        />
        <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-md text-white animate-pulse">
          <Phone size={20} />
        </div>
      </div>
      <div className="text-center">
        <h4 className="font-black text-xl text-gray-800 dark:text-white">
          Incoming Call
        </h4>
        <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">
          {incomingCall}
        </p>
      </div>
      <div className="flex gap-4 w-full">
        <button
          onClick={onAccept}
          className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-md font-black flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-95"
        >
          <Phone size={24} /> Accept
        </button>
        <button
          onClick={onReject}
          className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-md font-black flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all active:scale-95"
        >
          <PhoneOff size={24} /> Reject
        </button>
      </div>
    </div>
  );
};

export default ChatVoiceCallModal;
