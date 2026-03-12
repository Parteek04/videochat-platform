'use client';

import { useEffect, useRef } from 'react';

interface VideoBoxProps {
  stream: MediaStream | null;
  muted?: boolean;
  label?: string;
  className?: string;
  isLocal?: boolean;
}

export default function VideoBox({ stream, muted = false, label, className = '', isLocal = false }: VideoBoxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (isLocal) {
    // Local video – small PIP card
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-[#1a1a2e] border border-white/10 shadow-2xl ${className}`}>
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-violet-500/30 flex items-center justify-center">
              <CameraOffIcon />
            </div>
          </div>
        )}
        {/* Label badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
          {label || 'You'}
        </div>
      </div>
    );
  }

  // Remote video – fullscreen
  return (
    <div className={`relative rounded-3xl overflow-hidden bg-[#111120] border border-white/5 shadow-2xl ${className}`}>
      {stream ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className="w-full h-full object-cover"
          />
          {/* Subtle bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 min-h-[280px]">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-600/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white/30 text-sm">
              {label === 'Stranger' ? 'Waiting for stranger…' : 'Camera off'}
            </p>
          </div>
        </div>
      )}

      {/* Label badge */}
      {label && (
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
          {label === 'Stranger' && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
          {label}
        </div>
      )}
    </div>
  );
}

function CameraOffIcon() {
  return (
    <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
    </svg>
  );
}
