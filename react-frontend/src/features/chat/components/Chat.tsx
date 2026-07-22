import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Users,
  Phone,
  Bot,
  GripVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, Badge } from "@/lib/flowbite-compat";
import websocketService from "../../../services/websocketService";
import authService from "../../../services/authService";
import axios from "axios";

import { processClientAiQuery } from "../utils/chatNluEngine";
import { useChatVoiceCall } from "../hooks/useChatVoiceCall";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

import ChatBubbleTrigger from "./ChatBubbleTrigger";
import ChatVoiceCallModal from "./ChatVoiceCallModal";
import ChatInputToolbar from "./ChatInputToolbar";
import ChatMessageList, { Message } from "./ChatMessageList";

const Chat: React.FC = () => {
  const currentUser: any = authService.getCurrentUser() || { username: "Guest", token: "" };
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [showOnlineList, setShowOnlineList] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>("System Guide (AI)");
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Custom Hooks for Voice Call & Voice Notes Logic
  const {
    isCalling,
    incomingCall,
    callActive,
    remoteAudioRef,
    startCall,
    acceptCall,
    stopCall,
  } = useChatVoiceCall();

  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    formatTime,
  } = useVoiceRecorder();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isOpen, selectedUser]);

  useEffect(() => {
    websocketService.connect(() => {
      console.log("WebSocket Connected");
    });

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const sendVoiceMessage = (audioUrl: string) => {
    const chatMsg: Message = {
      content: "Voice Note",
      audioUrl,
      sender: currentUser.username,
      type: "CHAT",
      recipient: selectedUser || undefined,
    };
    setChatMessages((prev) => [...prev, { ...chatMsg, timestamp: new Date() }]);
  };

  const handleStartRecording = () => {
    startRecording(sendVoiceMessage);
  };

  const sendQuickQuery = (queryText: string) => {
    const chatMsg: Message = {
      content: queryText,
      sender: currentUser?.username || "User",
      type: "CHAT",
      recipient: "System Guide (AI)",
    };
    setChatMessages((prev) => [...prev, { ...chatMsg, timestamp: new Date() }]);
    setMessage("");
    setIsAiThinking(true);

    const token = currentUser?.token || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .post("/api/chat", { message: queryText }, { headers })
      .then((res) => {
        const botMsg: Message = {
          content: res.data.response || "I am currently unable to process your request.",
          sender: "System Guide (AI)",
          type: "CHAT",
          recipient: currentUser?.username || "User",
          actionLabel: res.data.actionLabel,
          actionLink: res.data.actionLink,
          suggestedTopics: res.data.suggestedTopics,
        };
        setChatMessages((prev) => [...prev, { ...botMsg, timestamp: new Date() }]);
      })
      .catch((error) => {
        console.error("Chat error:", error);
        const fallbackMsg = processClientAiQuery(queryText, currentUser?.username || "User");
        setChatMessages((prev) => [...prev, { ...fallbackMsg, timestamp: new Date() }]);
      })
      .finally(() => {
        setIsAiThinking(false);
      });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const username = currentUser?.username || "User";
    if (selectedUser === "System Guide (AI)") {
      const chatMsg: Message = {
        content: message,
        sender: username,
        type: "CHAT",
        recipient: selectedUser,
      };
      setChatMessages((prev) => [...prev, { ...chatMsg, timestamp: new Date() }]);
      const userQuery = message;
      setMessage("");
      setIsAiThinking(true);

      const token = currentUser?.token || localStorage.getItem("token") || "";
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const res = await axios.post("/api/chat", { message: chatMsg.content }, { headers });
        const botMsg: Message = {
          content: res.data.response || "I am currently unable to process your request.",
          sender: "System Guide (AI)",
          type: "CHAT",
          recipient: username,
          actionLabel: res.data.actionLabel,
          actionLink: res.data.actionLink,
          suggestedTopics: res.data.suggestedTopics,
        };
        setChatMessages((prev) => [...prev, { ...botMsg, timestamp: new Date() }]);
      } catch (error) {
        console.error("Chat error:", error);
        const fallbackMsg = processClientAiQuery(userQuery, username);
        setChatMessages((prev) => [...prev, { ...fallbackMsg, timestamp: new Date() }]);
      } finally {
        setIsAiThinking(false);
      }
      return;
    }

    const chatMsg: Message = {
      content: message,
      sender: currentUser.username,
      type: "CHAT",
      recipient: selectedUser || undefined,
    };
    if (selectedUser) {
      websocketService.sendMessage("/app/chat.privateMessage", chatMsg);
      setChatMessages((prev) => [...prev, { ...chatMsg, timestamp: new Date() }]);
    } else {
      websocketService.sendMessage("/app/chat.sendMessage", chatMsg);
    }
    setMessage("");
  };

  const filteredMessages = chatMessages.filter((msg) => {
    if (!selectedUser) return !msg.recipient;
    return (
      (msg.sender === selectedUser && msg.recipient === currentUser.username) ||
      (msg.sender === currentUser.username && msg.recipient === selectedUser)
    );
  });

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{
        left: -windowSize.width + 120,
        right: 0,
        top: -windowSize.height + 120,
        bottom: 0,
      }}
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end select-none"
    >
      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />

      {incomingCall && (
        <ChatVoiceCallModal
          incomingCall={incomingCall}
          onAccept={() => acceptCall(currentUser.username)}
          onReject={stopCall}
        />
      )}

      {!isOpen && (
        <ChatBubbleTrigger
          totalUnread={totalUnread}
          onOpen={() => setIsOpen(true)}
        />
      )}

      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[24rem] md:w-[26rem] h-[38rem] max-h-[85vh] bg-white dark:bg-gray-800 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div
            className={`p-4 text-white flex justify-between items-center relative overflow-hidden transition-colors duration-500 cursor-grab active:cursor-grabbing ${
              callActive ? "bg-green-600" : isCalling ? "bg-orange-500" : "bg-blue-600"
            }`}
            title="Drag to move chat window anywhere"
          >
            <div className="flex items-center gap-2 relative z-10">
              <GripVertical size={16} className="text-white/60 shrink-0" />
              <div className="relative">
                <Avatar
                  placeholderInitials={
                    selectedUser ? selectedUser.substring(0, 2).toUpperCase() : "PS"
                  }
                  rounded
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    websocketService.isConnected() ? "bg-green-500" : "bg-red-500"
                  } animate-pulse`}
                />
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight flex items-center gap-1">
                  <span>{selectedUser || "Public Channel"}</span>
                  {selectedUser === "System Guide (AI)" && (
                    <Badge color="indigo" size="xs">AI</Badge>
                  )}
                </h3>
                <span className="text-[10px] opacity-80 font-bold uppercase tracking-wider">
                  {callActive ? "In Call..." : isCalling ? "Calling..." : "Online"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 relative z-10">
              {selectedUser && selectedUser !== "System Guide (AI)" && (
                <button
                  onClick={callActive ? stopCall : () => startCall(selectedUser, currentUser.username)}
                  className={`p-2 rounded-lg transition-all ${
                    callActive
                      ? "bg-red-500 text-white animate-pulse"
                      : "hover:bg-white/20 text-white"
                  }`}
                  title="Voice Call"
                >
                  <Phone size={18} />
                </button>
              )}
              <button
                onClick={() => setShowOnlineList(!showOnlineList)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-white relative"
                title="Active Users"
              >
                <Users size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Active Users Sidebar Dropdown */}
          {showOnlineList && (
            <div className="p-3 bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex gap-2 overflow-x-auto">
              <button
                onClick={() => {
                  setSelectedUser("System Guide (AI)");
                  setShowOnlineList(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                  selectedUser === "System Guide (AI)"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50"
                }`}
              >
                <Bot size={14} />
                <span>System Guide (AI)</span>
              </button>
              {onlineUsers.map((user) => (
                <button
                  key={user}
                  onClick={() => {
                    setSelectedUser(user);
                    setShowOnlineList(false);
                    setUnreadCounts((prev) => ({ ...prev, [user]: 0 }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                    selectedUser === user
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50"
                  }`}
                >
                  <span>{user}</span>
                </button>
              ))}
            </div>
          )}

          {/* Message List */}
          <ChatMessageList
            filteredMessages={filteredMessages}
            currentUser={currentUser}
            selectedUser={selectedUser}
            isAiThinking={isAiThinking}
            messagesEndRef={messagesEndRef}
            sendQuickQuery={sendQuickQuery}
          />

          {/* Input Toolbar */}
          <ChatInputToolbar
            message={message}
            setMessage={setMessage}
            selectedUser={selectedUser}
            isRecording={isRecording}
            recordingTime={recordingTime}
            startRecording={handleStartRecording}
            stopRecording={stopRecording}
            handleSendMessage={handleSendMessage}
            formatTime={formatTime}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Chat;
