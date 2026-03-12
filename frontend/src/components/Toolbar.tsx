'use client';

interface ToolbarProps {
  onSkip: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onReport: () => void;
  onBlock: () => void;
  micEnabled: boolean;
  camEnabled: boolean;
  status: 'idle' | 'waiting' | 'connected';
  onFindPeer: () => void;
  onEndChat: () => void;
}

export default function Toolbar({
  onSkip,
  onToggleMic,
  onToggleCam,
  onReport,
  onBlock,
  micEnabled,
  camEnabled,
  status,
  onFindPeer,
  onEndChat,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">

      {/* ── Report Button ── */}
      {status === 'connected' && (
        <button
          onClick={onReport}
          title="Report User"
          data-tooltip="Report"
          className="tooltip w-12 h-12 rounded-full flex items-center justify-center bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/20 text-amber-400 transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <FlagIcon />
        </button>
      )}

      {/* ── Block Button ── */}
      {status === 'connected' && (
        <button
          onClick={onBlock}
          title="Block User"
          data-tooltip="Block"
          className="tooltip w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <BlockIcon />
        </button>
      )}

      {/* ── Mic Toggle ── */}
      <button
        onClick={onToggleMic}
        title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        data-tooltip={micEnabled ? 'Mute' : 'Unmute'}
        className={`tooltip w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 ${
          micEnabled
            ? 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
            : 'bg-red-500 hover:bg-red-600 border border-red-400/30 text-white'
        }`}
      >
        {micEnabled ? <MicIcon /> : <MicOffIcon />}
      </button>

      {/* ── Camera Toggle ── */}
      <button
        onClick={onToggleCam}
        title={camEnabled ? 'Disable Camera' : 'Enable Camera'}
        data-tooltip={camEnabled ? 'Camera Off' : 'Camera On'}
        className={`tooltip w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 ${
          camEnabled
            ? 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
            : 'bg-red-500 hover:bg-red-600 border border-red-400/30 text-white'
        }`}
      >
        {camEnabled ? <CamIcon /> : <CamOffIcon />}
      </button>

      {/* ── Main Action Buttons ── */}
      {status === 'idle' && (
        <button
          onClick={onFindPeer}
          className="px-7 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-violet-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <DiceIcon />
          Find Stranger
        </button>
      )}

      {status === 'connected' && (
        <>
          <button
            onClick={onSkip}
            className="px-7 py-3 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <SkipIcon />
            Next
          </button>
          <button
            onClick={onEndChat}
            className="px-7 py-3 bg-red-500/80 hover:bg-red-600 border border-red-400/20 text-white font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <EndIcon />
            End Chat
          </button>
        </>
      )}
    </div>
  );
}

/* ── SVG Icon Components ───────────────────────────────────────────── */

const iconProps = { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.8 } as const;

function MicIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>;
}

function MicOffIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;
}

function CamIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></svg>;
}

function CamOffIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841.172l.001-.007L15.75 10.5M3 3l18 18" /></svg>;
}

function FlagIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" /></svg>;
}

function BlockIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
}

function DiceIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" /></svg>;
}

function SkipIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" /></svg>;
}

function EndIcon() {
  return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" /></svg>;
}
