import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Room } from '../models/Room';
import { User } from '../models/User';

interface WaitingUser {
  socketId: string;
  uid?: string;
  gender: string;   // 'male' | 'female' | 'both'
  country: string;  // ISO country code or 'global'
  joinedAt: number; // timestamp for queue timeout
}

// In-memory waiting queue – supports 500+ users
const waitingQueue: WaitingUser[] = [];

// Map of socketId -> roomId
const socketRoomMap = new Map<string, string>();

// Active connections counter
let activeConnections = 0;

// ── Matching Logic ────────────────────────────────────────────────────────────
function findMatch(seeker: WaitingUser): number {
  for (let i = 0; i < waitingQueue.length; i++) {
    const candidate = waitingQueue[i];

    // Skip self (shouldn't happen but safety check)
    if (candidate.socketId === seeker.socketId) continue;

    // Gender matching: 'both' matches anyone; specific gender must match
    const genderMatch =
      seeker.gender === 'both' ||
      candidate.gender === 'both' ||
      seeker.gender === candidate.gender;

    // Country matching: 'global' matches anyone; specific country must match
    const countryMatch =
      seeker.country === 'global' ||
      candidate.country === 'global' ||
      seeker.country === candidate.country;

    if (genderMatch && countryMatch) {
      console.log(`🎯 Match possible with candidate ${candidate.socketId}`);
      return i;
    }
  }
  return -1;
}

// ── Stale queue cleanup (every 60s) ─────────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  const before = waitingQueue.length;
  for (let i = waitingQueue.length - 1; i >= 0; i--) {
    if (now - waitingQueue[i].joinedAt > 120_000) {
      waitingQueue.splice(i, 1);
    }
  }
  if (waitingQueue.length !== before) {
    console.log(`🧹 Cleaned stale queue entries: ${before} → ${waitingQueue.length}`);
  }
}, 60_000);

export const registerSocketHandlers = (io: Server): void => {
  // Broadcast active count every 5 seconds
  setInterval(() => {
    io.emit('server:stats', { activeConnections, queueSize: waitingQueue.length });
  }, 5_000);

  io.on('connection', (socket: Socket) => {
    activeConnections++;
    console.log(`🔗 Socket connected: ${socket.id} | Active: ${activeConnections}`);

    // ── FIND A RANDOM PEER ─────────────────────────────────────────────────
    socket.on(
      'find-peer',
      async ({
        uid,
        gender = 'both',
        country = 'global',
      }: {
        uid?: string;
        gender?: string;
        country?: string;
      }) => {
        // Update user online status (non-blocking)
        if (uid) {
          User.findOneAndUpdate({ uid }, { isOnline: true, gender, country }).catch(() => {});
        }

        // Check if already in a room – prevent double-join
        if (socketRoomMap.has(socket.id)) return;

        const seeker: WaitingUser = {
          socketId: socket.id,
          uid,
          gender,
          country,
          joinedAt: Date.now(),
        };

        const matchIdx = findMatch(seeker);
        console.log(`🔍 Searching match for ${socket.id}. Queue size: ${waitingQueue.length}`);

        if (matchIdx >= 0) {
          const peer = waitingQueue.splice(matchIdx, 1)[0];
          console.log(`✅ Match found: ${socket.id} <-> ${peer.socketId}`);
          const roomId = uuidv4();
          socketRoomMap.set(socket.id, roomId);
          socketRoomMap.set(peer.socketId, roomId);

          // Join both sockets to the room
          socket.join(roomId);
          const peerSocket = io.sockets.sockets.get(peer.socketId);
          if (peerSocket) {
            peerSocket.join(roomId);
            console.log(`🏠 Both joined room ${roomId}`);
          } else {
            console.error(`❌ Peer socket ${peer.socketId} not found!`);
          }

          // Persist room in MongoDB (fire-and-forget for speed)
          Room.create({
            roomId,
            participants: [uid, peer.uid].filter(Boolean),
            status: 'active',
          }).catch(() => {});
          io.to(peer.socketId).emit('peer-found', {
            roomId,
            isInitiator: true,
            peerUid: uid,
            peerGender: gender,
            peerCountry: country,
          });
          socket.emit('peer-found', {
            roomId,
            isInitiator: false,
            peerUid: peer.uid,
            peerGender: peer.gender,
            peerCountry: peer.country,
          });
        } else {
          // Add to waiting queue
          waitingQueue.push(seeker);
          socket.emit('waiting', { queuePosition: waitingQueue.length });
          console.log(`⏳ Added to queue: ${socket.id}. Total waiting: ${waitingQueue.length}`);
        }
      },
    );

    // ── CANCEL SEARCH ──────────────────────────────────────────────────────
    socket.on('cancel-search', () => {
      const idx = waitingQueue.findIndex((w) => w.socketId === socket.id);
      if (idx !== -1) waitingQueue.splice(idx, 1);
      socket.emit('search-cancelled');
    });

    // ── WEBRTC SIGNALING ───────────────────────────────────────────────────
    socket.on(
      'webrtc-offer',
      ({ roomId, offer }: { roomId: string; offer: RTCSessionDescriptionInit }) => {
        socket.to(roomId).emit('webrtc-offer', { offer });
      },
    );

    socket.on(
      'webrtc-answer',
      ({ roomId, answer }: { roomId: string; answer: RTCSessionDescriptionInit }) => {
        socket.to(roomId).emit('webrtc-answer', { answer });
      },
    );

    socket.on(
      'ice-candidate',
      ({ roomId, candidate }: { roomId: string; candidate: RTCIceCandidateInit }) => {
        socket.to(roomId).emit('ice-candidate', { candidate });
      },
    );

    // ── CHAT MESSAGES ──────────────────────────────────────────────────────
    socket.on(
      'chat-message',
      ({ roomId, message, senderName }: { roomId: string; message: string; senderName: string }) => {
        // Basic spam protection: message length limit
        if (!message || message.trim().length === 0 || message.length > 500) return;
        socket.to(roomId).emit('chat-message', {
          message: message.trim(),
          senderName,
          timestamp: new Date().toISOString(),
        });
      },
    );

    // ── SKIP / NEXT PEER ───────────────────────────────────────────────────
    socket.on('skip', async ({ roomId, uid }: { roomId: string; uid?: string }) => {
      await endRoom(socket, roomId, uid, io);
    });

    // ── TYPING INDICATOR ───────────────────────────────────────────────────
    socket.on('typing', ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit('peer-typing');
    });

    socket.on('stop-typing', ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit('peer-stop-typing');
    });

    // ── DISCONNECT ─────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      activeConnections = Math.max(0, activeConnections - 1);
      console.log(`💔 Socket disconnected: ${socket.id} | Active: ${activeConnections}`);

      // Remove from waiting queue
      const idx = waitingQueue.findIndex((w) => w.socketId === socket.id);
      if (idx !== -1) waitingQueue.splice(idx, 1);

      // End any active room
      const roomId = socketRoomMap.get(socket.id);
      if (roomId) {
        await endRoom(socket, roomId, undefined, io);
      }
    });
  });
};

async function endRoom(
  socket: Socket,
  roomId: string,
  uid: string | undefined,
  io: Server,
): Promise<void> {
  socket.to(roomId).emit('peer-disconnected');
  socket.leave(roomId);

  // Clean up socket-room mappings for this room
  for (const [sid, rid] of socketRoomMap.entries()) {
    if (rid === roomId) socketRoomMap.delete(sid);
  }

  // Mark room as ended in MongoDB (fire-and-forget)
  Room.findOneAndUpdate({ roomId }, { status: 'ended', endedAt: new Date() }).catch(() => {});

  // Update user online status
  if (uid) {
    User.findOneAndUpdate({ uid }, { isOnline: false, $inc: { totalChats: 1 } }).catch(() => {});
  }
}
