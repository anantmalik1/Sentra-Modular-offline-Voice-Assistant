import React from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';

export default function MicControl({
  isListening,
  onToggleListen,
  state,
  onQuickCommand,
  disabled = false,
}) {
  const quickSuggestions = [
    "Open YouTube",
    "What time is it?",
    "Write a binary search tree in Python",
    "Create a linked list in C++",
    "Create a Snake game in Python",
    "Search quantum computing",
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-4">
      {/* Primary Voice Activation Button */}
      <div className="relative group">
        {/* Animated Glow Rings */}
        <div
          className={`absolute -inset-2 rounded-full blur-lg opacity-70 transition-all duration-500 ${
            isListening
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 scale-110 animate-pulse'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 group-hover:opacity-75'
          }`}
        />

        <button
          onClick={onToggleListen}
          disabled={disabled}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full border-2 transition-all duration-300 transform active:scale-95 shadow-2xl ${
            isListening
              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_35px_rgba(0,255,136,0.6)]'
              : 'bg-slate-900/90 border-cyan-400/60 text-cyan-300 hover:border-cyan-300 hover:text-white shadow-[0_0_25px_rgba(0,247,255,0.3)]'
          }`}
          title="Click to speak (Voice-First Trigger)"
        >
          {isListening ? (
            <Mic className="w-9 h-9 animate-bounce" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Voice Status Subtitle */}
      <div className="text-center">
        <p className="text-xs tracking-widest uppercase font-mono text-cyan-400/80">
          {isListening
            ? '● ACTIVE LISTENING // SPEAK NOW...'
            : 'VOICE PRIMARY // TAP MIC OR SELECT DIRECTIVE'}
        </p>
      </div>

      {/* Quick Spoken Directive Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-md">
        {quickSuggestions.map((cmd, i) => (
          <button
            key={i}
            onClick={() => onQuickCommand(cmd)}
            className="px-3 py-1 text-xs font-mono text-slate-300 bg-slate-900/60 hover:bg-cyan-950/70 border border-slate-700/60 hover:border-cyan-400/60 rounded-full transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-1 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 text-cyan-400 mr-1 opacity-70" />
            <span>"{cmd}"</span>
          </button>
        ))}
      </div>
    </div>
  );
}
