import React from "react";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { Avatar } from "@/lib/flowbite-compat";

export interface Message {
  content: string;
  sender: string;
  type: string;
  recipient?: string;
  actionLabel?: string;
  actionLink?: string;
  suggestedTopics?: string[];
  audioUrl?: string;
  timestamp?: Date;
}

interface ChatMessageListProps {
  filteredMessages: Message[];
  currentUser: { username: string };
  selectedUser: string | null;
  isAiThinking: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  sendQuickQuery: (queryText: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  filteredMessages,
  currentUser,
  selectedUser,
  isAiThinking,
  messagesEndRef,
  sendQuickQuery,
}) => {
  const renderBoldText = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={i}
            className="font-black text-indigo-700 dark:text-indigo-300"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-2">
        {lines.map((line, lIdx) => {
          if (!line.trim()) return null;

          // Header match (e.g. ### Title)
          if (line.startsWith("### ")) {
            return (
              <h4
                key={lIdx}
                className="font-black text-sm text-indigo-900 dark:text-indigo-200 border-b border-indigo-100 dark:border-indigo-800/40 pb-1.5 mb-2 mt-1 flex items-center gap-2"
              >
                <span>{line.replace("### ", "")}</span>
              </h4>
            );
          }

          // Numbered step match (e.g. 1. **Step Name**)
          const stepMatch = line.match(/^(\d+)\.\s*(.*)/);
          if (stepMatch) {
            return (
              <div
                key={lIdx}
                className="flex items-start gap-2 text-xs font-medium leading-relaxed my-1.5 pl-1"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800">
                  {stepMatch[1]}
                </span>
                <span className="flex-1">{renderBoldText(stepMatch[2])}</span>
              </div>
            );
          }

          // Bullet item match
          const bulletMatch = line.match(/^[-\*]\s*(.*)/);
          if (bulletMatch) {
            return (
              <div
                key={lIdx}
                className="flex items-center gap-2 pl-2 text-xs font-medium my-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>{renderBoldText(bulletMatch[1])}</span>
              </div>
            );
          }

          return (
            <p key={lIdx} className="text-xs font-medium leading-relaxed">
              {renderBoldText(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/60 dark:bg-gray-900/60">
      {filteredMessages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 dark:text-gray-500 space-y-3">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-full text-indigo-600 dark:text-indigo-400">
            <Bot size={32} />
          </div>
          <div>
            <h4 className="font-black text-sm text-gray-700 dark:text-gray-200">
              MTP AI System Guide
            </h4>
            <p className="text-xs font-medium mt-1 max-w-[200px]">
              Ask me about Hardware Assets, Clinic Inpatients, RBAC Permissions, or Billing!
            </p>
          </div>
        </div>
      ) : (
        filteredMessages.map((msg, index) => {
          const isCurrentUser = msg.sender === currentUser.username;
          const isSystemBot = msg.sender === "System Guide (AI)";

          return (
            <div
              key={index}
              className={`flex flex-col ${
                isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                {!isCurrentUser && (
                  <Avatar
                    placeholderInitials={msg.sender.substring(0, 2).toUpperCase()}
                    rounded
                    size="xs"
                  />
                )}
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  {msg.sender}
                </span>
              </div>

              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-xs leading-relaxed ${
                  isCurrentUser
                    ? "bg-blue-600 text-white rounded-tr-none font-medium"
                    : isSystemBot
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-indigo-100 dark:border-indigo-900/40 shadow-indigo-500/5"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none font-medium"
                }`}
              >
                {msg.audioUrl ? (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                      <span>🎤 Voice Note</span>
                    </div>
                    <audio
                      src={msg.audioUrl}
                      controls
                      className="w-full h-8 rounded"
                    />
                  </div>
                ) : isSystemBot ? (
                  renderFormattedContent(msg.content)
                ) : (
                  msg.content
                )}

                {/* Module Action Link */}
                {msg.actionLink && (
                  <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/50 flex justify-end">
                    <a
                      href={msg.actionLink}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] shadow-sm transition-all hover:gap-3"
                    >
                      <span>{msg.actionLabel || "Open Module"}</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Topics */}
              {msg.suggestedTopics && msg.suggestedTopics.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[85%] pl-1">
                  {msg.suggestedTopics.map((topic, tIdx) => (
                    <button
                      key={tIdx}
                      onClick={() => sendQuickQuery(topic)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200/60 dark:border-indigo-800/60 transition-all hover:scale-105 active:scale-95"
                    >
                      <Sparkles size={10} className="text-indigo-500" />
                      <span>{topic}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* AI Thinking Indicator */}
      {isAiThinking && (
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 p-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="text-xs font-bold italic ml-1">AI Guide is analyzing...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
