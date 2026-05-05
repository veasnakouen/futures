import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Circle, Users, Search, Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { Avatar, Badge, Button, TextInput, Modal } from 'flowbite-react';
import websocketService from '../../services/websocketService';
import authService from '../../services/authService';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Message {
  id?: number;
  content: string;
  sender: string;
  recipient?: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'CALL_OFFER' | 'CALL_ANSWER' | 'ICE_CANDIDATE' | 'CALL_REJECT' | 'AUDIO';
  sentAt?: string;
  timestamp?: Date;
}

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [showOnlineList, setShowOnlineList] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
  
  // Voice Call State
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState<string | null>(null);
  const [callActive, setCallActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const pendingOfferRef = useRef<any>(null);
  const iceCandidatesQueue = useRef<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = authService.getCurrentUser();

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!currentUser) return null;

  useEffect(() => {
    fetchHistory();
    
    if (currentUser) {
      websocketService.connect(() => {
        // Public messages
        websocketService.subscribe('/topic/public', (msg: any) => {
          const formattedMsg = { ...msg, timestamp: msg.sentAt ? new Date(msg.sentAt) : new Date() };
          if (!msg.recipient) {
            setChatMessages(prev => [...prev, formattedMsg]);
            if (!isOpen && (msg.type === 'CHAT' || msg.type === 'AUDIO') && msg.sender !== currentUser.username) {
              setUnreadCounts(prev => ({ ...prev, public: (prev.public || 0) + 1 }));
            }
          }
        });

        // Private messages & signaling
        websocketService.subscribe('/user/queue/messages', (msg: any) => {
          const formattedMsg = { ...msg, timestamp: msg.sentAt ? new Date(msg.sentAt) : new Date() };
          
          if (msg.type === 'CHAT' || msg.type === 'AUDIO') {
            setChatMessages(prev => [...prev, formattedMsg]);
            if (!isOpen || selectedUser !== msg.sender) {
              const icon = msg.type === 'AUDIO' ? '🎙️' : '💬';
              toast.success(`New ${msg.type.toLowerCase()} from ${msg.sender}`, { icon, position: 'bottom-right' });
              setUnreadCounts(prev => ({ ...prev, [msg.sender]: (prev[msg.sender] || 0) + 1 }));
            }
          } else {
            handleSignalingMessage(msg);
          }
        });

        websocketService.subscribe('/topic/onlineUsers', (users: string[]) => {
          setOnlineUsers(users.filter(u => u !== currentUser.username));
        });
      });
    }

    return () => {
      stopCall();
    };
  }, []);

  // --- WebRTC Logic ---

  const handleSignalingMessage = async (msg: Message) => {
    switch (msg.type) {
      case 'CALL_OFFER':
        pendingOfferRef.current = JSON.parse(msg.content);
        setIncomingCall(msg.sender);
        break;
      case 'CALL_ANSWER':
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(JSON.parse(msg.content));
          setCallActive(true);
          setIsCalling(false);
        }
        break;
      case 'ICE_CANDIDATE':
        const candidate = JSON.parse(msg.content);
        if (pcRef.current && pcRef.current.remoteDescription) {
          try {
            await pcRef.current.addIceCandidate(candidate);
          } catch (e) { console.error("Error adding candidate", e); }
        } else {
          // Queue the candidate if the connection isn't ready
          iceCandidatesQueue.current.push(candidate);
        }
        break;
      case 'CALL_REJECT':
        toast.error(`${msg.sender} ended the call`);
        stopCall();
        break;
    }
  };

  const initPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.services.mozilla.com' }
      ]
    });

    pc.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected') {
        toast.success('Voice tunnel established!');
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && selectedUser) {
        websocketService.sendMessage('/app/chat.privateMessage', {
          sender: currentUser.username,
          recipient: selectedUser,
          type: 'ICE_CANDIDATE',
          content: JSON.stringify(event.candidate)
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('Incoming audio track received:', event.streams[0]);
      const stream = event.streams[0];
      
      // Log track status for debugging
      stream.getAudioTracks().forEach(track => {
        console.log(`Track: ${track.label}, Enabled: ${track.enabled}, ReadyState: ${track.readyState}`);
      });

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.volume = 1.0;
        
        // Explicitly play and ensure it's not muted
        const playPromise = remoteAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Auto-play was prevented. Adding manual play trigger.", error);
            // We can add a "Click to Hear" button if this continues to fail
          });
        }
      }
    };

    pcRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    if (!selectedUser) return;
    
    if (!window.isSecureContext) {
      toast.error('Voice chat requires HTTPS or localhost');
      return;
    }

    setIsCalling(true);
    iceCandidatesQueue.current = []; // Clear queue
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getAudioTracks().forEach(track => {
        track.enabled = true;
        console.log(`Accepting with track: ${track.label}`);
      });
      setLocalStream(stream);
      
      const pc = initPeerConnection();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      websocketService.sendMessage('/app/chat.privateMessage', {
        sender: currentUser.username,
        recipient: selectedUser,
        type: 'CALL_OFFER',
        content: JSON.stringify(offer)
      });
    } catch (err: any) {
      toast.error('Microphone access failed');
      setIsCalling(false);
    }
  };

  const acceptCall = async () => {
    if (!incomingCall || !pendingOfferRef.current) {
      toast.error('No pending call found');
      return;
    }

    const caller = incomingCall;
    setSelectedUser(caller);
    setIncomingCall(null);
    iceCandidatesQueue.current = []; // Clear queue

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getAudioTracks().forEach(track => {
        track.enabled = true;
        console.log(`Local track active: ${track.label}`);
      });
      setLocalStream(stream);
      
      const pc = initPeerConnection();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      await pc.setRemoteDescription(pendingOfferRef.current);
      
      // Process any queued candidates
      for (const candidate of iceCandidatesQueue.current) {
        await pc.addIceCandidate(candidate);
      }
      iceCandidatesQueue.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      websocketService.sendMessage('/app/chat.privateMessage', {
        sender: currentUser.username,
        recipient: caller,
        type: 'CALL_ANSWER',
        content: JSON.stringify(answer)
      });
      
      setCallActive(true);
    } catch (err: any) {
      console.error('Failed to accept call:', err);
      toast.error(`Accept failed: ${err.name || 'Check permissions'}`);
      stopCall();
    }
  };

  const stopCall = () => {
    // Only send the reject signal if we are actually in a call process
    if ((isCalling || callActive || incomingCall) && (selectedUser || incomingCall)) {
      websocketService.sendMessage('/app/chat.privateMessage', {
        sender: currentUser.username,
        recipient: selectedUser || incomingCall,
        type: 'CALL_REJECT'
      });
    }

    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    pcRef.current?.close();
    pcRef.current = null;
    setIsCalling(false);
    setCallActive(false);
    setIncomingCall(null);
    pendingOfferRef.current = null;
    
    if (callActive) toast.error('Call ended');
  };
  
  // --- Voice Note Logic ---

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped, chunks:', audioChunksRef.current.length);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('Blob created, size:', audioBlob.size);
        if (audioBlob.size > 0) {
          await sendVoiceNote(audioBlob);
        } else {
          toast.error('Recording was empty');
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      console.log('MediaRecorder started');
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Recording start failed:', err);
      toast.error('Microphone access failed');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const sendVoiceNote = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'voice_note.webm');
    console.log('Uploading voice note to backend...');

    try {
      const loadingToast = toast.loading('Uploading voice note...');
      const response = await axios.post('/api/chat/upload-voice', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      
      console.log('Upload successful, URL:', response.data.url);
      const audioUrl = response.data.url;
      const audioMsg: Message = { 
        content: audioUrl, 
        sender: currentUser.username, 
        type: 'AUDIO', 
        recipient: selectedUser || undefined 
      };

      if (selectedUser) {
        websocketService.sendMessage('/app/chat.privateMessage', audioMsg);
        setChatMessages(prev => [...prev, { ...audioMsg, timestamp: new Date() }]);
      } else {
        websocketService.sendMessage('/app/chat.sendMessage', audioMsg);
      }
      
      toast.dismiss(loadingToast);
      toast.success('Voice note sent!');
    } catch (err: any) {
      console.error('Upload failed:', err.response?.data || err.message);
      toast.error('Failed to upload voice note');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- UI Helpers ---

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`/api/chat/history/user/${currentUser.username}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setChatMessages(response.data.map((msg: any) => ({ ...msg, timestamp: new Date(msg.sentAt) })));
    } catch (err) {}
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [chatMessages, isOpen, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const chatMsg: Message = { content: message, sender: currentUser.username, type: 'CHAT', recipient: selectedUser || undefined };
      if (selectedUser) {
        websocketService.sendMessage('/app/chat.privateMessage', chatMsg);
        setChatMessages(prev => [...prev, { ...chatMsg, timestamp: new Date() }]);
      } else {
        websocketService.sendMessage('/app/chat.sendMessage', chatMsg);
      }
      setMessage('');
    }
  };

  const filteredMessages = chatMessages.filter(msg => {
    if (!selectedUser) return !msg.recipient;
    return (msg.sender === selectedUser && msg.recipient === currentUser.username) ||
      (msg.sender === currentUser.username && msg.recipient === selectedUser);
  });

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Audio Element for Remote Stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[90vw] max-w-sm bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-4 border-blue-500 animate-in zoom-in-95 duration-300 flex flex-col items-center gap-6">
          <div className="relative">
            <Avatar placeholderInitials={incomingCall.substring(0, 2).toUpperCase()} rounded size="xl" className="ring-4 ring-blue-500/20" />
            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full text-white animate-pulse"><Phone size={20} /></div>
          </div>
          <div className="text-center">
            <h4 className="font-black text-xl text-gray-800 dark:text-white">Incoming Call</h4>
            <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">{incomingCall}</p>
          </div>
          <div className="flex gap-4 w-full">
            <button onClick={acceptCall} className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-95">
              <Phone size={24} /> Accept
            </button>
            <button onClick={stopCall} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all active:scale-95">
              <PhoneOff size={24} /> Reject
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="relative group">
        {!isOpen && totalUnread > 0 && (
          <div className="absolute -top-1 -right-1 z-10">
            <span className="relative flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 text-white text-[10px] font-black items-center justify-center border-2 border-white dark:border-gray-800">
                {totalUnread}
              </span>
            </span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen
            ? 'bg-white dark:bg-gray-800 text-gray-500 ring-2 ring-blue-500/20'
            : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[24rem] md:w-[26rem] h-[38rem] max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className={`p-5 text-white flex justify-between items-center relative overflow-hidden transition-colors duration-500 ${callActive ? 'bg-green-600' : isCalling ? 'bg-orange-500' : 'bg-blue-600'}`}>
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <Avatar placeholderInitials={selectedUser ? selectedUser.substring(0, 2).toUpperCase() : 'PS'} rounded />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${websocketService.isConnected() ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} title={websocketService.isConnected() ? 'Connected' : 'Disconnected'} />
              </div>
              <div>
                <h3 className="font-black text-sm">{selectedUser ? (callActive ? 'In Call with ' + selectedUser : isCalling ? 'Calling ' + selectedUser + '...' : 'Chat with ' + selectedUser) : 'Public Square'}</h3>
                <div className="flex gap-2">
                  <button onClick={() => setShowOnlineList(!showOnlineList)} className="text-[10px] font-bold text-white/80 uppercase"><Users size={10} className="inline mr-1" /> {onlineUsers.length} Online</button>
                  {selectedUser && !callActive && <button onClick={() => setSelectedUser(null)} className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded uppercase">Public</button>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
              {selectedUser && !callActive && !isCalling && (
                <button onClick={startCall} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full transition-all animate-pulse">
                  <Phone size={20} />
                </button>
              )}
              {(callActive || isCalling) && (
                <button onClick={stopCall} className="p-2.5 bg-red-500 hover:bg-red-600 rounded-full transition-all">
                  <PhoneOff size={20} />
                </button>
              )}
              <button onClick={() => setShowOnlineList(!showOnlineList)} className="p-2 hover:bg-white/10 rounded-lg"><Users size={20} /></button>
            </div>
          </div>

          {/* Online Users List */}
          {showOnlineList && (
            <div className="absolute top-20 left-0 right-0 bottom-0 bg-white dark:bg-gray-800 z-[100] p-6 animate-in slide-in-from-top-4 duration-300 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-xs uppercase tracking-widest">Select Colleague</h4>
                <button onClick={() => setShowOnlineList(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={16} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {onlineUsers.map((user, idx) => (
                  <div key={idx} onClick={() => { setSelectedUser(user); setShowOnlineList(false); }} className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-all">
                    <Avatar placeholderInitials={user.substring(0, 2).toUpperCase()} rounded size="sm" />
                    <div className="flex-1">
                      <span className="text-sm font-bold block">{user}</span>
                      <span className="text-[10px] text-green-500 font-bold uppercase">Online</span>
                    </div>
                    {unreadCounts[user] > 0 && <Badge color="failure" size="xs">{unreadCounts[user]}</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/20 space-y-4 custom-scrollbar">
            {filteredMessages.map((msg, idx) => {
              if (msg.type === 'JOIN' || msg.type === 'LEAVE') return null;
              if (msg.type !== 'CHAT') return null; // Only show text messages
              const isMe = msg.sender === currentUser.username;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                  <div className={`max-w-[85%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-black">{msg.sender}</span>
                      <span className="text-[9px] font-bold text-gray-400">{msg.timestamp ? format(msg.timestamp, 'HH:mm') : ''}</span>
                    </div>
                    
                    {msg.type === 'AUDIO' ? (
                      <div className={`p-2 rounded-2xl shadow-sm ${isMe ? 'bg-blue-600 rounded-tr-none' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-none'}`}>
                        <audio src={msg.content} controls className="h-8 max-w-[200px]" />
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-none'}`}>
                        {msg.content}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white dark:bg-gray-800 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
              <button 
                type="button" 
                onClick={isRecording ? stopRecording : startRecording} 
                title={isRecording ? "Stop & Send" : "Record Voice Note"}
                className={`p-3 rounded-2xl transition-all flex items-center justify-center ${
                  isRecording 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600'
                }`}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {isRecording ? (
                <div className="flex-1 flex items-center gap-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="text-xs font-black text-red-600 uppercase tracking-widest">Recording: {formatTime(recordingTime)}</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={selectedUser ? `Message ${selectedUser}...` : "Broadcast..."}
                    className="flex-1 bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" disabled={!message.trim()} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xl active:scale-95 transition-all"><Send size={24} /></button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
