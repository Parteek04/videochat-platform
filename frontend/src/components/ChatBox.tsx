'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'me' | 'stranger';
  senderName: string;
  timestamp: string;
}

interface ChatBoxProps {
  messages: Message[];
  onSend: (text: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
  isPeerTyping?: boolean;
}

export default function ChatBox({
  messages,
  onSend,
  onTyping,
  onStopTyping,
  disabled = false,
  isPeerTyping = false,
}: ChatBoxProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPeerTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    onStopTyping?.();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      onTyping?.();
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => onStopTyping?.(), 1500);
    } else {
      onStopTyping?.();
    }
  };

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <h3 className="text-white/80 text-sm font-semibold">Live Chat</h3>
        {isPeerTyping && (
          <span className="text-xs text-violet-400 ml-auto animate-pulse">Stranger is typing…</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <p className="text-white text-sm">Say hi to your stranger!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-white/30 text-[10px]">{msg.senderName}</span>
              <span className="text-white/20 text-[10px]">{formatTime(msg.timestamp)}</span>
            </div>
            <div
              className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm break-words leading-relaxed ${
                msg.sender === 'me'
                  ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-tr-sm'
                  : msg.senderName === 'System'
                  ? 'bg-white/5 text-white/50 text-xs italic rounded-2xl text-center w-full max-w-full'
                  : 'bg-white/10 text-white/90 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isPeerTyping && (
          <div className="flex items-start">
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'Connect to start chatting…' : 'Type a message…'}
          maxLength={500}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-40 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/20 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
