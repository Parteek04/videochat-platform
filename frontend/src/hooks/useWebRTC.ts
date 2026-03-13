'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  }
]

interface UseWebRTCOptions {
  socket: Socket | null
  roomId: string | null
  isInitiator: boolean
  localStream: MediaStream | null
}

export function useWebRTC({ socket, roomId, isInitiator, localStream }: UseWebRTCOptions) {

  const peerRef = useRef<RTCPeerConnection | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream>(new MediaStream())

  const createPeer = useCallback(() => {

    const peer = new RTCPeerConnection({
      iceServers: ICE_SERVERS
    })

    peer.onicecandidate = (event) => {
      if (event.candidate && socket && roomId) {
        socket.emit('ice-candidate', {
          roomId,
          candidate: event.candidate.toJSON()
        })
      }
    }

    peer.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current.addTrack(track)
      })
      setRemoteStream(remoteStreamRef.current)
    }

    return peer

  }, [socket, roomId])

  const startCall = useCallback(async () => {

    if (!socket || !roomId || !localStream) return

    if (peerRef.current) {
      peerRef.current.close()
    }

    const peer = createPeer()
    peerRef.current = peer
    remoteStreamRef.current = new MediaStream()

    localStream.getTracks().forEach(track => {
      peer.addTrack(track, localStream)
    })

    if (isInitiator) {

      const offer = await peer.createOffer()

      await peer.setLocalDescription(offer)

      socket.emit('webrtc-offer', {
        roomId,
        offer
      })
    }

  }, [socket, roomId, localStream, isInitiator, createPeer])

  const closePeer = useCallback(() => {

    if (peerRef.current) {
      peerRef.current.close()
      peerRef.current = null
    }

    setRemoteStream(null)
    remoteStreamRef.current = new MediaStream()

  }, [])

  useEffect(() => {

    if (!socket) return

    const handleOffer = async ({ offer }: any) => {

      if (!peerRef.current) return

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer))

      const answer = await peerRef.current.createAnswer()

      await peerRef.current.setLocalDescription(answer)

      socket.emit('webrtc-answer', { roomId, answer })

    }

    const handleAnswer = async ({ answer }: any) => {

      if (!peerRef.current) return

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer))

    }

    const handleIceCandidate = async ({ candidate }: any) => {

      if (!peerRef.current) return

      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate))

    }

    socket.on('webrtc-offer', handleOffer)
    socket.on('webrtc-answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)

    return () => {
      socket.off('webrtc-offer', handleOffer)
      socket.off('webrtc-answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
    }

  }, [socket, roomId])

  useEffect(() => {

    if (roomId && socket && localStream) {
      startCall()
    }

    return () => closePeer()

  }, [roomId, socket, localStream, startCall, closePeer])

  return { remoteStream, closePeer }
}
