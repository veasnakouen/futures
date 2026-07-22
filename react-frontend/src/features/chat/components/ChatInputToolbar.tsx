import React from "react";
import { Mic, MicOff, Send } from "lucide-react";

interface ChatInputToolbarProps {
  message: string;
  setMessage: (msg: string) => void;
  selectedUser: string | null;
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  handleSendMessage: (e: React.FormEvent) => void;
  formatTime: (sec: number) => string;
}

export const ChatInputToolbar: React.FC<ChatInputToolbarProps> = ({
  message,
  setMessage,
  selectedUser,
  isRecording,
  recordingTime,
  startRecording,
  stopRecording,
  handleSendMessage,
  formatTime,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
      <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? "Stop & Send" : "Record Voice Note"}
          className={`p-3 rounded-md transition-all flex items-center justify-center ${
            isRecording
              ? "bg-red-600 text-white animate-pulse"
              : "bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600"
          }`}
        >
          {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {isRecording ? (
          <div className="flex-1 flex items-center gap-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <div className="w-2 h-2 rounded-md bg-red-600 animate-ping" />
            <span className="text-xs font-black text-red-600 uppercase tracking-widest">
              Recording: {formatTime(recordingTime)}
            </span>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedUser ? `Message ${selectedUser}...` : "Broadcast..."
              }
              className="flex-1 bg-gray-50 dark:bg-gray-700 border-none rounded-md px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-md shadow-xl active:scale-95 transition-all"
            >
              <Send size={24} />
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ChatInputToolbar;
