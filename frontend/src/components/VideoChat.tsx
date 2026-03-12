'use client';

import { RefObject } from 'react';
import VideoBox from '@/components/VideoBox';
import Toolbar from '@/components/Toolbar';
import MatchingScreen from '@/components/MatchingScreen';

interface VideoChatProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  status: 'idle' | 'waiting' | 'connected';
  micEnabled: boolean;
  camEnabled: boolean;
  queuePosition?: number;
  onFindPeer: () => void;
  onSkip: () => void;
  onCancelSearch: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onReport: () => void;
  onBlock: () => void;
  onEndChat: () => void;
  videoContainerRef?: RefObject<HTMLDivElement | null>;
}

export default function VideoChat({
  localStream,
  remoteStream,
  status,
  micEnabled,
  camEnabled,
  queuePosition,
  onFindPeer,
  onSkip,
  onCancelSearch,
  onToggleMic,
  onToggleCam,
  onReport,
  onBlock,
  onEndChat,
  videoContainerRef,
}: VideoChatProps) {
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* ── Video Area ── */}
      <div className="relative flex-1 min-h-0" ref={videoContainerRef}>
        {/* Remote video fullscreen */}
        <VideoBox
          stream={remoteStream}
          label="Stranger"
          className="w-full h-full min-h-[280px] sm:min-h-[400px]"
        />

        {/* Local video PIP */}
        <div className="absolute bottom-3 right-3 w-28 h-36 sm:w-36 sm:h-48 z-20 shadow-2xl rounded-2xl overflow-hidden ring-2 ring-violet-500/40">
          <VideoBox
            stream={localStream}
            muted
            label="You"
            isLocal
            className="w-full h-full"
          />
        </div>

        {/* Matching Screen Overlay */}
        {status === 'waiting' && (
          <MatchingScreen queuePosition={queuePosition} onCancel={onCancelSearch} />
        )}

        {/* Idle overlay */}
        {status === 'idle' && !remoteStream && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-[#0a0a0f]/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-5xl mb-4 animate-float">🎲</div>
              <h3 className="text-white text-xl font-bold mb-2">Ready to Meet?</h3>
              <p className="text-white/40 text-sm">Click "Find Stranger" to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="glass rounded-2xl p-4">
        <Toolbar
          status={status}
          onFindPeer={onFindPeer}
          onSkip={onSkip}
          onToggleMic={onToggleMic}
          onToggleCam={onToggleCam}
          onReport={onReport}
          onBlock={onBlock}
          onEndChat={onEndChat}
          micEnabled={micEnabled}
          camEnabled={camEnabled}
        />
      </div>
    </div>
  );
}
