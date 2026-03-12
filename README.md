# 🎲 RandomChat — Random Video Chat Platform

A production-ready **full-stack random video chat** platform. Meet strangers over live video in one click, powered by WebRTC peer-to-peer connections.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + TypeScript + TailwindCSS |
| Backend | Node.js + Express + TypeScript |
| Real-time | Socket.IO (WebRTC signaling) |
| Video | Browser WebRTC (`RTCPeerConnection`) |
| Database | MongoDB + Mongoose |
| Auth | Firebase Auth (Google Sign-In) |
| Code Quality | ESLint + Prettier |

## Folder Structure

```
videochat-platform/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts         # MongoDB connection
│   │   │   └── firebase.ts   # Firebase Admin SDK
│   │   ├── middleware/
│   │   │   └── auth.ts       # Firebase token verification
│   │   ├── models/
│   │   │   ├── User.ts       # MongoDB User model
│   │   │   └── Room.ts       # MongoDB Room model
│   │   ├── routes/
│   │   │   ├── auth.ts       # POST /api/auth/sync, GET /api/auth/me
│   │   │   ├── users.ts      # GET /api/users/online-count
│   │   │   └── rooms.ts      # GET /api/rooms/stats
│   │   ├── socket/
│   │   │   └── socketHandlers.ts  # WebRTC signaling + peer matching
│   │   └── index.ts          # Express + Socket.IO entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                 # Next.js 15 App Router
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx    # Root layout + AuthProvider
    │   │   ├── globals.css   # Global styles
    │   │   ├── page.tsx      # Landing page
    │   │   └── chat/
    │   │       └── page.tsx  # Video chat room page
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── VideoBox.tsx
    │   │   ├── ChatBox.tsx
    │   │   └── Toolbar.tsx
    │   ├── hooks/
    │   │   ├── useAuth.tsx   # Firebase auth context
    │   │   ├── useSocket.ts  # Socket.IO client
    │   │   └── useWebRTC.ts  # RTCPeerConnection management
    │   └── lib/
    │       ├── firebase.ts   # Firebase client SDK
    │       └── api.ts        # Axios + auth interceptor
    ├── .env.local.example
    └── package.json
```

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- [Firebase project](https://console.firebase.google.com) with Google Sign-In enabled

## Installation

### 1. Clone & navigate
```bash
cd videochat-platform
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and Firebase Admin credentials
npm install
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your Firebase client SDK keys
npm install
npm run dev
```

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin private key |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin client email |
| `FRONTEND_URL` | CORS allowed origin |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client SDK config |

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Health check |
| POST | `/api/auth/sync` | Yes | Sync Firebase user to MongoDB |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/users/online-count` | No | Online users count |
| GET | `/api/rooms/stats` | No | Active room stats |

## Socket.IO Events

| Event (client→server) | Description |
|---|---|
| `find-peer` | Join waiting queue for random match |
| `skip` | Skip current partner, find new one |
| `webrtc-offer` | Relay WebRTC offer SDP |
| `webrtc-answer` | Relay WebRTC answer SDP |
| `ice-candidate` | Relay ICE candidate |
| `chat-message` | Send a chat message |

| Event (server→client) | Description |
|---|---|
| `waiting` | In the waiting queue |
| `peer-found` | Matched with a stranger |
| `peer-disconnected` | Stranger left |
| `webrtc-offer` | Incoming offer |
| `webrtc-answer` | Incoming answer |
| `ice-candidate` | Incoming ICE candidate |
| `chat-message` | Incoming chat message |

## How It Works

```
User A              Server               User B
  |-- find-peer -----→|                    |
  |                   |←--- find-peer ------
  |←- peer-found -----|-- peer-found ------→|
  |-- webrtc-offer -->|-- webrtc-offer ----→|
  |                   |←-- webrtc-answer ---
  |←- webrtc-answer --|                    |
  |←------- ICE candidates ---------------→|
  |                                        |
  |←========== P2P Video Call ============→|
```

## Development Scripts

### Backend
| Command | Description |
|---|---|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
