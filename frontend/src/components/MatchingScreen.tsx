'use client';

interface MatchingScreenProps {
  queuePosition?: number;
  onCancel: () => void;
}

export default function MatchingScreen({ queuePosition, onCancel }: MatchingScreenProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0a0f]/95 backdrop-blur-sm rounded-3xl">
      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer ring 1 */}
        <div className="absolute w-40 h-40 rounded-full border-2 border-violet-500/20 pulse-ring" />
        {/* Outer ring 2 */}
        <div className="absolute w-28 h-28 rounded-full border-2 border-violet-500/30 pulse-ring-2" />
        {/* Spinning border ring */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-violet-500 border-r-cyan-400 animate-spin-slow" />
        {/* Center icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <h2 className="text-white text-2xl font-bold mb-2">Finding Your Match</h2>
      <p className="text-white/50 text-sm mb-1">Scanning {queuePosition ? `${queuePosition} people` : 'the globe'} for you…</p>
      
      {/* Animated dots */}
      <div className="flex items-center gap-1.5 mt-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 mb-8 text-center">
        <div>
          <p className="text-white font-bold text-lg">12.4M+</p>
          <p className="text-white/40 text-xs">Total Users</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div>
          <p className="text-green-400 font-bold text-lg animate-pulse">LIVE</p>
          <p className="text-white/40 text-xs">Matching Now</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div>
          <p className="text-white font-bold text-lg">🌎</p>
          <p className="text-white/40 text-xs">Global</p>
        </div>
      </div>

      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm font-medium bg-white/5 hover:bg-white/10"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Cancel Search
      </button>
    </div>
  );
}
