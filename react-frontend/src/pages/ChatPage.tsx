import { useState, useEffect, useRef } from 'react'
import { Card, Button, Avatar, Badge, TextInput, Spinner } from 'flowbite-react'
import { 
  Send, Users, MessageCircle, 
  Search, Circle, User as UserIcon,
  Clock, Hash
} from 'lucide-react'
import Layout from '../components/Layout'
import websocketService from '../services/websocketService'
import authService from '../services/authService'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ChatPage = ({ isDark, setIsDark }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
       window.location.href = '/login';
       return;
    }
    setUser(currentUser);
    setLoading(false);

    // Connect and Join
    websocketService.connect(() => {
       // Join Public Chat
       websocketService.sendMessage('/app/chat.addUser', {
          sender: currentUser.username,
          type: 'JOIN'
       });

       // Subscribe to Public Messages
       websocketService.subscribe('/topic/public', (msg) => {
          setMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
       });

       // Subscribe to Online Users List
       websocketService.subscribe('/topic/onlineUsers', (users) => {
          setOnlineUsers(users);
       });
    });

    return () => {
       // Optional: Leave message
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    websocketService.sendMessage('/app/chat.sendMessage', {
       sender: user.username,
       content: messageText,
       type: 'CHAT'
    });
    setMessageText('');
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl"/></div>;

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Team Chat">
      <div className="flex h-[calc(100vh-12rem)] gap-6 animate-fade-in">
        
        {/* Sidebar: Online Users */}
        <div className="w-80 flex flex-col gap-4">
           <Card className="border-none shadow-sm dark:bg-gray-800 flex-1 overflow-hidden p-0">
              <div className="p-4 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    <span className="font-black dark:text-white uppercase text-[10px] tracking-widest">Active Users</span>
                 </div>
                 <Badge color="success" className="rounded-full">{onlineUsers.length}</Badge>
              </div>
              <div className="p-4">
                 <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                       type="text" 
                       placeholder="Search colleagues..." 
                       className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-700/50 border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none dark:text-white"
                    />
                 </div>
                 <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-25rem)] pr-2">
                    {onlineUsers.map((onlineUser, idx) => (
                       <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer group">
                          <div className="relative">
                             <Avatar placeholderInitials={onlineUser?.substring(0,2).toUpperCase() || 'U'} rounded size="sm" />
                             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{onlineUser}</p>
                             <p className="text-[10px] text-gray-400 font-medium">Online now</p>
                          </div>
                          <MessageCircle size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    ))}
                 </div>
              </div>
           </Card>

           <Card className="border-none shadow-sm dark:bg-gray-800 p-4">
              <div className="flex items-center gap-3">
                 <Avatar placeholderInitials={user?.username?.substring(0,2).toUpperCase() || 'U'} rounded />
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-black dark:text-white truncate">{user?.username}</p>
                    <div className="flex items-center gap-1.5">
                       <Circle size={8} fill="currentColor" className="text-green-500" />
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available</span>
                    </div>
                 </div>
              </div>
           </Card>
        </div>

        {/* Main Chat Area */}
        <Card className="flex-1 border-none shadow-xl dark:bg-gray-800 p-0 overflow-hidden flex flex-col">
           {/* Chat Header */}
           <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                    <Hash size={20} />
                 </div>
                 <div>
                    <h3 className="font-black dark:text-white">General Announcements</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Users size={10}/> Public Channel • {onlineUsers.length} Members
                    </p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <Button color="gray" size="xs" className="rounded-lg border-none"><Clock size={16}/></Button>
                 <Button color="gray" size="xs" className="rounded-lg border-none"><Search size={16}/></Button>
              </div>
           </div>

           {/* Messages List */}
           <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gray-50/30 dark:bg-gray-900/10"
           >
              {messages.map((msg, idx) => {
                 const isMe = msg.sender === user?.username;
                 const isSystem = msg.type === 'JOIN' || msg.type === 'LEAVE';

                 if (isSystem) {
                    return (
                       <div key={idx} className="flex justify-center my-4">
                          <Badge color="gray" className="rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
                             {msg.sender} {msg.type === 'JOIN' ? 'joined the conversation' : 'left the chat'}
                          </Badge>
                       </div>
                    );
                 }

                 return (
                    <div key={idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                       <Avatar placeholderInitials={msg.sender?.substring(0,2).toUpperCase() || 'U'} rounded size="sm" className="mt-1" />
                       <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                             <span className="text-xs font-black dark:text-white">{msg.sender}</span>
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                {msg.timestamp ? format(msg.timestamp, 'HH:mm') : 'Recently'}
                             </span>
                          </div>
                          <div className={`p-4 rounded-lg text-sm shadow-sm ${
                             isMe 
                             ? 'bg-blue-600 text-white rounded-tr-none' 
                             : 'bg-white dark:bg-gray-700 dark:text-gray-200 rounded-tl-none'
                          }`}>
                             {msg.content}
                          </div>
                       </div>
                    </div>
                 );
              })}
              {messages.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                    <MessageCircle size={80} className="mb-4" />
                    <h4 className="text-xl font-black">No messages yet</h4>
                    <p className="text-sm font-medium">Be the first to start the conversation!</p>
                 </div>
              )}
           </div>

           {/* Message Input */}
           <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                 <div className="relative flex-1">
                    <TextInput 
                       value={messageText}
                       onChange={(e) => setMessageText(e.target.value)}
                       placeholder="Type your message here..."
                       className="rounded-lg"
                       theme={{ field: { input: { colors: { gray: 'bg-gray-50 dark:bg-gray-700 border-none' } } } }}
                    />
                 </div>
                 <Button type="submit" color="blue" className="rounded-lg px-6 shadow-xl shadow-blue-500/20">
                    <Send size={18} className="mr-2" />
                    <span className="font-bold">Send</span>
                 </Button>
              </form>
           </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ChatPage;
