'use client';

import { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import VideoChat from '@/components/VideoChat';
import api from '@/lib/api';

type Status = 'idle' | 'waiting' | 'connected';
type ChatMessage = { text: string; sender: 'me' | 'stranger'; senderName: string; timestamp: string };

function ChatPageInner() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters from landing page
  const gender = searchParams.get('gender') || 'both';
  const country = searchParams.get('country') || 'global';

  const [status, setStatus] = useState<Status>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [strangerUid, setStrangerUid] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [isPeerTyping, setIsPeerTyping] = useState(false);

  const peerTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { remoteStream, closePeer } = useWebRTC({ socket, roomId, isInitiator, localStream });

  // ── Get local media on mount ───────────────────────────────────────────────
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: true })
      .then((stream) => setLocalStream(stream))
      .catch((err) => {
        console.error('Media access denied:', err);
        // Try audio-only fallback
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => setLocalStream(stream))
          .catch(() => {});
      });

    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Socket event listeners ─────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    socket.on('waiting', ({ queuePosition: pos }: { queuePosition?: number }) => {
      setStatus('waiting');
      setQueuePosition(pos || 0);
    });

    socket.on(
      'peer-found',
      ({
        roomId: rid,
        isInitiator: init,
        peerUid,
      }: {
        roomId: string;
        isInitiator: boolean;
        peerUid: string;
      }) => {
        setRoomId(rid);
        setIsInitiator(init);
        setStatus('connected');
        setMessages([]);
        setSessionStartTime(new Date());
        setStrangerUid(peerUid);
        setQueuePosition(0);
      },
    );

    socket.on('peer-disconnected', () => {
      logSession();
      closePeer();
      setRoomId(null);
      setStatus('idle');
      setSessionStartTime(null);
      setStrangerUid(null);
      setIsPeerTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Stranger disconnected.',
          sender: 'stranger',
          senderName: 'System',
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on(
      'chat-message',
      ({
        message,
        senderName,
        timestamp,
      }: {
        message: string;
        senderName: string;
        timestamp: string;
      }) => {
        setMessages((prev) => [...prev, { text: message, sender: 'stranger', senderName, timestamp }]);
      },
    );

    socket.on('peer-typing', () => {
      setIsPeerTyping(true);
      if (peerTypingTimerRef.current) clearTimeout(peerTypingTimerRef.current);
      peerTypingTimerRef.current = setTimeout(() => setIsPeerTyping(false), 2000);
    });

    socket.on('peer-stop-typing', () => {
      setIsPeerTyping(false);
    });

    socket.on('search-cancelled', () => {
      setStatus('idle');
      setQueuePosition(0);
    });

    return () => {
      socket.off('waiting');
      socket.off('peer-found');
      socket.off('peer-disconnected');
      socket.off('chat-message');
      socket.off('peer-typing');
      socket.off('peer-stop-typing');
      socket.off('search-cancelled');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const findPeer = useCallback(() => {
    if (!socket) return;
    setStatus('waiting');
    socket.emit('find-peer', { uid: user?.uid, gender, country });
  }, [socket, user, gender, country]);

  const cancelSearch = useCallback(() => {
    if (!socket) return;
    socket.emit('cancel-search');
    setStatus('idle');
  }, [socket]);

  const skipPeer = useCallback(() => {
    if (!socket) return;
    logSession();
    if (roomId) {
      socket.emit('skip', { roomId, uid: user?.uid });
      closePeer();
      setRoomId(null);
    }
    setStatus('waiting');
    setSessionStartTime(null);
    setStrangerUid(null);
    setIsPeerTyping(false);
    socket.emit('find-peer', { uid: user?.uid, gender, country });
  }, [socket, roomId, user, gender, country, closePeer]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(
    (text: string) => {
      if (!socket || !roomId) return;
      const senderName = user?.displayName || 'You';
      socket.emit('chat-message', { roomId, message: text, senderName });
      setMessages((prev) => [
        ...prev,
        { text, sender: 'me', senderName, timestamp: new Date().toISOString() },
      ]);
    },
    [socket, roomId, user],
  );

  const toggleMic = useCallback(() => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setMicEnabled((prev) => !prev);
  }, [localStream]);

  const toggleCam = useCallback(() => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setCamEnabled((prev) => !prev);
  }, [localStream]);

  const logSession = useCallback(async () => {
    if (!sessionStartTime || !roomId || !user) return;
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 1000);
    try {
      await api.post('/api/sessions', {
        participants: [user.uid, strangerUid].filter(Boolean),
        startTime: sessionStartTime,
        endTime,
        duration,
      });
    } catch {
      // Non-critical
    }
  }, [sessionStartTime, roomId, user, strangerUid]);

  const handleReport = useCallback(async () => {
    if (!strangerUid) return;
    const reason = window.prompt('Reason for reporting:');
    if (!reason) return;
    try {
      await api.post('/api/reports', { reportedId: strangerUid, reason });
      alert('Report submitted. Thank you!');
    } catch {
      alert('Failed to submit report.');
    }
  }, [strangerUid]);

  const handleBlock = useCallback(async () => {
    if (!strangerUid) return;
    if (!window.confirm('Block this user? They will not be matched with you again.')) return;
    try {
      await api.post('/api/bans', { bannedUid: strangerUid, reason: 'Blocked by user' });
      skipPeer();
    } catch {
      alert('Failed to block user.');
    }
  }, [strangerUid, skipPeer]);

  const endChat = useCallback(() => {
    logSession();
    if (localStream) localStream.getTracks().forEach((t) => t.stop());
    if (roomId && socket) socket.emit('skip', { roomId, uid: user?.uid });
    closePeer();
    router.push('/');
  }, [localStream, roomId, socket, user, closePeer, router, logSession]);

  const handleTyping = useCallback(() => {
    if (socket && roomId) socket.emit('typing', { roomId });
  }, [socket, roomId]);

  const handleStopTyping = useCallback(() => {
    if (socket && roomId) socket.emit('stop-typing', { roomId });
  }, [socket, roomId]);

  const localVideoRef = useRef<HTMLDivElement>(null);

  return (
    <div className="gradient-bg min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 pt-6 max-w-[1400px] mx-auto w-full">
        {/* Video area */}
        <div className="flex-1 min-h-0 min-w-0">
          <VideoChat
            localStream={localStream}
            remoteStream={remoteStream}
            status={status}
            micEnabled={micEnabled}
            camEnabled={camEnabled}
            queuePosition={queuePosition}
            onFindPeer={findPeer}
            onSkip={skipPeer}
            onCancelSearch={cancelSearch}
            onToggleMic={toggleMic}
            onToggleCam={toggleCam}
            onReport={handleReport}
            onBlock={handleBlock}
            onEndChat={endChat}
            videoContainerRef={localVideoRef}
          />
        </div>

        {/* Chat panel */}
        <div className="w-full lg:w-80 h-72 lg:h-auto flex flex-col">
          <ChatBox
            messages={messages}
            onSend={sendMessage}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
            disabled={status !== 'connected'}
            isPeerTyping={isPeerTyping}
          />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageInner />
    </Suspense>
  );
}
