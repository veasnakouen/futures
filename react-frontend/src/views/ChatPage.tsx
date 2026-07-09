import { useState, useEffect, useRef } from "react";
import {Spinner} from '@/lib/flowbite-compat';
import {
  Send,
  Users,
  MessageCircle,
  Search,
  Hash,
  Lock,
  MoreVertical,
  Phone,
  Video,
  Info,
  CheckCheck,
} from "lucide-react";

import websocketService from "../services/websocketService";
import authService from "../services/authService";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSearchParams } from '@/lib/react-router-compat';
import api from "../services/api";

const ChatPage = ({ isDark, setIsDark }: any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatWithParam = searchParams.get("chatWith");

  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messageText, setMessageText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeChannel, setActiveChannel] = useState<string>("public"); // 'public' or username
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWithParam) {
      setActiveChannel(chatWithParam);
    } else {
      setActiveChannel("public");
    }
  }, [chatWithParam]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }
    setUser(currentUser);
    setLoading(false);

    websocketService.connect(() => {
      websocketService.sendMessage("/app/chat.addUser", {
        sender: currentUser.username,
        type: "JOIN",
      });

      websocketService.subscribe("/topic/public", (msg) => {
        setMessages((prev) => {
          if (activeChannel === "public")
            return [
              ...prev,
              { ...msg, timestamp: new Date(msg.sentAt || Date.now()) },
            ];
          return prev;
        });
      });

      websocketService.subscribe("/user/queue/private", (msg) => {
        setMessages((prev) => {
          if (activeChannel === msg.sender || activeChannel === msg.recipient) {
            return [
              ...prev,
              { ...msg, timestamp: new Date(msg.sentAt || Date.now()) },
            ];
          }
          return prev;
        });
        if (
          activeChannel !== msg.sender &&
          msg.sender !== currentUser.username
        ) {
          toast.success(`New message from ${msg.sender}`, { icon: "💬" });
        }
      });

      websocketService.subscribe("/topic/onlineUsers", (users) => {
        setOnlineUsers(users);
      });
    });

    return () => { };
  }, [activeChannel]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const fetchHistory = async () => {
      try {
        if (activeChannel === "public") {
          const res = await api.get("/chat/history/public");
          setMessages(
            res.data.map((m: any) => ({ ...m, timestamp: new Date(m.sentAt) })),
          );
        } else {
          const res = await api.get(
            `/chat/history/private?user1=${currentUser.username}&user2=${activeChannel}`,
          );
          setMessages(
            res.data.map((m: any) => ({ ...m, timestamp: new Date(m.sentAt) })),
          );
        }
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };
    fetchHistory();
  }, [activeChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (activeChannel === "public") {
      websocketService.sendMessage("/app/chat.sendMessage", {
        sender: user.username,
        content: messageText,
        type: "CHAT",
      });
    } else {
      const msg = {
        sender: user.username,
        recipient: activeChannel,
        content: messageText,
        type: "CHAT",
      };
      websocketService.sendMessage("/app/chat.privateMessage", msg);
      setMessages((prev) => [...prev, { ...msg, timestamp: new Date() }]);
    }

    setMessageText("");
  };

  const switchChannel = (channel: string) => {
    if (channel === "public") {
      setSearchParams({});
    } else {
      setSearchParams({ chatWith: channel });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="xl" />
      </div>
    );

  return (
    <>
      <div className="flex h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900 animate-fade-in">
        {/* Modern Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-900/50 flex flex-col border-r">
          {/* Sidebar Header */}
          <div className="p-6 pb-4">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Messages
            </h2>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border-none rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
            <div className="mb-6">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Channels
                </span>
              </div>
              <button
                onClick={() => switchChannel("public")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeChannel ==="public"?"bg-blue-600 text-white shadow-md shadow-blue-500/20":"hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
              >
                <div
                  className={`p-2 rounded-lg ${activeChannel ==="public"?"bg-white/20":"bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
                >
                  <Hash size={16} />
                </div>
                <span className="font-bold text-sm">Public Square</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Direct Messages
                </span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {onlineUsers.length} Online
                </span>
              </div>
              <div className="space-y-1">
                {onlineUsers.map((onlineUser, idx) => {
                  const isActive = activeChannel === onlineUser;
                  return (
                    <button
                      key={idx}
                      onClick={() => switchChannel(onlineUser)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${isActive ?"bg-white dark:bg-gray-800 shadow-sm ":"hover:bg-white/50 dark:hover:bg-gray-800/50 border-transparent"}`}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black shadow-inner">
                          {onlineUser?.substring(0, 2).toUpperCase() || "U"}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p
                          className={`text-sm truncate ${isActive ?"font-black text-gray-900 dark:text-white":"font-bold text-gray-700 dark:text-gray-300"}`}
                        >
                          {onlineUser}
                        </p>
                        <p className="text-[11px] text-green-500 font-medium">
                          Active now
                        </p>
                      </div>
                      <MessageCircle
                        size={14}
                        className={`${isActive ?"text-blue-500 opacity-100":"text-gray-300 opacity-0 group-hover:opacity-100"} transition-opacity`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
          {/* Header */}
          <div className="h-[72px] px-6 border-b flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${activeChannel ==="public"?"bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-600 dark:text-blue-400":"bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-600 dark:text-purple-400"}`}
              >
                {activeChannel === "public" ? (
                  <Hash size={24} />
                ) : (
                  <Lock size={24} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                  {activeChannel === "public"
                    ? "General Announcements"
                    : activeChannel}
                </h3>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  {activeChannel === "public" ? (
                    <>
                      <Users size={12} /> Public Channel • {onlineUsers.length}{" "}
                      Online
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
                      Online securely
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-full transition-all">
                <Phone size={18} />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-full transition-all">
                <Video size={18} />
              </button>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                <Search size={18} />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                <Info size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 pt-[96px] pb-6 space-y-6 scroll-smooth custom-scrollbar"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(0,0,0,0.01) 0%, transparent 100%)",
            }}
          >
            {messages.map((msg, idx) => {
              const isMe = msg.sender === user?.username;
              const isSystem = msg.type === "JOIN" || msg.type === "LEAVE";

              if (isSystem) {
                return (
                  <div key={idx} className="flex justify-center my-6">
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-widest font-black rounded-full shadow-sm">
                      {msg.sender}{" "}
                      {msg.type === "JOIN"
                        ? "joined the conversation"
                        : "left the chat"}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[80%] ${isMe ?"ml-auto flex-row-reverse":""} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0 mt-auto mb-1">
                      {msg.sender?.substring(0, 2).toUpperCase() || "U"}
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${isMe ?"items-end":"items-start"}`}
                  >
                    {!isMe && (
                      <span className="text-[11px] font-bold text-gray-400 ml-1 mb-1">
                        {msg.sender}
                      </span>
                    )}

                    <div
                      className={`relative px-5 py-3 text-[15px] leading-relaxed shadow-sm ${isMe ?"bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-sm":"bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100  rounded-2xl rounded-bl-sm"}`}
                    >
                      {msg.content}
                    </div>

                    <div
                      className={`flex items-center gap-1 mt-1 ${isMe ?"mr-1":"ml-1"}`}
                    >
                      <span className="text-[10px] font-semibold text-gray-400">
                        {msg.timestamp ? format(msg.timestamp, "HH:mm") : "Now"}
                      </span>
                      {isMe && (
                        <CheckCheck size={12} className="text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <MessageCircle size={40} className="text-gray-400" />
                </div>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                  No messages yet
                </h4>
                <p className="text-sm font-bold text-gray-500">
                  Say hello and start the conversation!
                </p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 pt-2 bg-white dark:bg-gray-900">
            <form
              onSubmit={handleSendMessage}
              className="relative flex items-center"
            >
              <button
                type="button"
                className="absolute left-3 p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white dark:bg-gray-800 rounded-full shadow-sm z-10"
              >
                <MoreVertical size={20} />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={
                  activeChannel === "public"
                    ? "Message Public Square..."
                    : `Message ${activeChannel}...`
                }
                className="w-full pl-14 pr-16 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none dark:text-white shadow-inner transition-all"
              />

              <button
                type="submit"
                disabled={!messageText.trim()}
                className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/30 transition-all active:scale-95 z-10"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
