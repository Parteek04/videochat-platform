'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

// ── Public STUN + TURN servers (works across different networks) ─────────────
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  // Open TURN servers via Metered (works for cross-network)
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];

interface UseWebRTCOptions {
  socket: Socket | null;
  roomId: string | null;
  isInitiator: boolean;
  localStream: MediaStream | null;
}

export function useWebRTC({ socket, roomId, isInitiator, localStream }: UseWebRTCOptions) {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());

  const createPeer = useCallback(() => {
    const peer = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceCandidatePoolSize: 10, // Pre-gather ICE candidates for faster connection
    });

    peer.onicecandidate = (event) => {
      if (event.candidate && socket && roomId) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate.toJSON() });
      }
    };

    peer.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peer.iceConnectionState);
      if (peer.iceConnectionState === 'failed') {
        // Try ICE restart
        if (isInitiator) {
          peer.restartIce();
        }
      }
    };

    peer.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current.addTrack(track);
      });
      setRemoteStream(remoteStreamRef.current);
    };

    return peer;
  }, [socket, roomId, isInitiator]);

  const startCall = useCallback(async () => {
    if (!socket || !roomId || !localStream) return;

    // Clean up previous peer
    if (peerRef.current) {
      peerRef.current.close();
    }

    const peer = createPeer();
    peerRef.current = peer;
    remoteStreamRef.current = new MediaStream();

    // Add local tracks
    localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));

    if (isInitiator) {
      try {
        const offer = await peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
        await peer.setLocalDescription(offer);
        socket.emit('webrtc-offer', { roomId, offer });
      } catch (e) {
        console.error('Failed to create offer:', e);
      }
    }

    // Handle incoming offer (non-initiator)
    socket.on('webrtc-offer', async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      if (!peerRef.current || peerRef.current.signalingState === 'closed') return;
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit('webrtc-answer', { roomId, answer });
      } catch (e) {
        console.error('Failed to handle offer:', e);
      }
    });

    socket.on('webrtc-answer', async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (!peerRef.current || peerRef.current.signalingState === 'closed') return;
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (e) {
        console.error('Failed to set answer:', e);
      }
    });

    socket.on('ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (!peerRef.current || peerRef.current.signalingState === 'closed') return;
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn('ICE candidate error (non-fatal):', e);
      }
    });
  }, [socket, roomId, localStream, isInitiator, createPeer]);

  const closePeer = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    remoteStreamRef.current = new MediaStream();
    setRemoteStream(null);
  }, []);

  useEffect(() => {
    if (roomId && socket && localStream) {
      startCall();
    }
    return () => {
      closePeer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return { remoteStream, closePeer };
}
