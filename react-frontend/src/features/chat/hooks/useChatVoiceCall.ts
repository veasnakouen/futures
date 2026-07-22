import { useState, useRef } from "react";
import websocketService from "../../../services/websocketService";

export interface UseChatVoiceCallReturn {
  isCalling: boolean;
  incomingCall: string | null;
  callActive: boolean;
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
  startCall: (targetUser: string, currentUser: string) => Promise<void>;
  acceptCall: (currentUser: string) => Promise<void>;
  stopCall: () => void;
  handleCallSignal: (msg: any) => Promise<void>;
}

export const useChatVoiceCall = (): UseChatVoiceCallReturn => {
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState<string | null>(null);
  const [callActive, setCallActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const createPeerConnection = (targetUser: string, currentUser: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        websocketService.sendMessage("/app/chat.callSignal", {
          sender: currentUser,
          recipient: targetUser,
          type: "CALL_SIGNAL",
          signalType: "CANDIDATE",
          data: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    setPeerConnection(pc);
    return pc;
  };

  const handleCallSignal = async (msg: any) => {
    if (msg.signalType === "OFFER") {
      setIncomingCall(msg.sender);
      (window as any).pendingOffer = msg.data;
    } else if (msg.signalType === "ANSWER" && peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.data));
      setCallActive(true);
      setIsCalling(false);
    } else if (msg.signalType === "CANDIDATE" && peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(msg.data));
    } else if (msg.signalType === "REJECT" || msg.signalType === "END") {
      stopCall();
    }
  };

  const startCall = async (targetUser: string, currentUser: string) => {
    if (!targetUser) return;
    setIsCalling(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      const pc = createPeerConnection(targetUser, currentUser);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      websocketService.sendMessage("/app/chat.callSignal", {
        sender: currentUser,
        recipient: targetUser,
        type: "CALL_SIGNAL",
        signalType: "OFFER",
        data: offer,
      });
    } catch (err) {
      console.error("Failed to get media stream", err);
      setIsCalling(false);
    }
  };

  const acceptCall = async (currentUser: string) => {
    if (!incomingCall) return;
    const targetUser = incomingCall;
    setIncomingCall(null);
    setCallActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      const pc = createPeerConnection(targetUser, currentUser);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = (window as any).pendingOffer;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      websocketService.sendMessage("/app/chat.callSignal", {
        sender: currentUser,
        recipient: targetUser,
        type: "CALL_SIGNAL",
        signalType: "ANSWER",
        data: answer,
      });
    } catch (err) {
      console.error("Error accepting call", err);
      stopCall();
    }
  };

  const stopCall = () => {
    if (localStream) localStream.getTracks().forEach((t) => t.stop());
    if (peerConnection) peerConnection.close();
    setLocalStream(null);
    setPeerConnection(null);
    setIsCalling(false);
    setCallActive(false);
    setIncomingCall(null);
  };

  return {
    isCalling,
    incomingCall,
    callActive,
    remoteAudioRef,
    startCall,
    acceptCall,
    stopCall,
    handleCallSignal,
  };
};

export default useChatVoiceCall;
