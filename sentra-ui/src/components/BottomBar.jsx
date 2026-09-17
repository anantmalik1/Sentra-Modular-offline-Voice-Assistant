import React from 'react';
import { MapPin, CloudSun, Wifi, Play } from 'lucide-react';

export default function BottomBar({
  state = 'IDLE',
  onToggleVoice,
  location = 'Bhimber, Pak...',
  weather = '28°C Overcast',
  network = 'Excellent',
}) {
  const isListening = state === 'LISTENING';
  const isSpeaking = state === 'SPEAKING';

  return (
    <footer className="flex items-center justify-between px-4 py-3 w-full border border-cyan-400/25 bg-[#081124]/90 backdrop-blur-md rounded-xl mt-3 shadow-[0_0_15px_rgba(0,217,255,0.1)]">
      {/* Left: Location + Weather + Network status pills */}
      <div className="flex items-center space-x-3">
        {/* Location */}
        <div
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono"
          style={{
            background: 'rgba(8, 20, 44, 0.85)',
            border: '1px solid rgba(0, 247, 255, 0.2)',
          }}
        >
          <MapPin size={15} className="text-cyan-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Location</span>
            <span className="text-slate-100 font-bold text-[13px]">{location}</span>
          </div>
        </div>

        {/* Weather */}
        <div
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono"
          style={{
            background: 'rgba(8, 20, 44, 0.85)',
            border: '1px solid rgba(0, 247, 255, 0.2)',
          }}
        >
          <CloudSun size={15} className="text-amber-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Weather</span>
            <span className="text-slate-100 font-bold text-[13px]">{weather}</span>
          </div>
        </div>

        {/* Network */}
        <div
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono"
          style={{
            background: 'rgba(8, 20, 44, 0.85)',
            border: '1px solid rgba(0, 247, 255, 0.2)',
          }}
        >
          <Wifi size={15} className="text-emerald-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Network</span>
            <span className="text-emerald-400 font-bold text-[13px]">{network}</span>
          </div>
        </div>
      </div>

      {/* Decorative waveform divider */}
      <div className="hidden lg:flex items-center space-x-1 px-4 opacity-40">
        {[2, 4, 3, 5, 2, 6, 4, 7, 3, 5, 2, 4, 3].map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-cyan-400"
            style={{ height: `${h * 2.5}px` }}
          />
        ))}
      </div>

      {/* Center: Glowing Pill "TALK TO SENTRA" with 16px text */}
      <button
        onClick={onToggleVoice}
        className="flex items-center space-x-4 px-8 py-2.5 rounded-full transition-all group relative cursor-pointer"
        style={{
          background: isListening
            ? 'radial-gradient(ellipse at center, rgba(0, 255, 136, 0.3) 0%, rgba(6, 20, 36, 0.95) 80%)'
            : 'radial-gradient(ellipse at center, rgba(0, 247, 255, 0.25) 0%, rgba(6, 18, 40, 0.95) 80%)',
          border: isListening ? '2px solid #00ff88' : '2px solid #00f7ff',
          boxShadow: isListening
            ? '0 0 30px rgba(0, 255, 136, 0.6), inset 0 0 12px rgba(0, 255, 136, 0.3)'
            : '0 0 25px rgba(0, 247, 255, 0.4), inset 0 0 10px rgba(0, 247, 255, 0.25)',
          minWidth: '280px',
        }}
        title="Trigger Voice Pipeline (POST /voice/listen)"
      >
        {/* Animated Sound Wave Graphic */}
        <div className="flex items-center space-x-1">
          {[4, 8, 14, 7, 16, 9, 5].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all ${
                isListening ? 'bg-emerald-300 animate-pulse' : 'bg-cyan-300'
              }`}
              style={{
                height: isListening ? `${h * 1.5}px` : `${Math.max(h * 0.9, 4)}px`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center flex-1 leading-none">
          <span
            className="font-mono font-black text-[16px] tracking-widest uppercase transition-colors"
            style={{
              color: isListening ? '#00ff88' : '#00f7ff',
              textShadow: isListening
                ? '0 0 10px rgba(0, 255, 136, 0.9)'
                : '0 0 10px rgba(0, 247, 255, 0.9)',
            }}
          >
            TALK TO SENTRA
          </span>
          <span className="font-mono text-[11px] text-slate-400 mt-1">
            {isListening
              ? 'I am listening...'
              : isSpeaking
              ? 'Sentra is speaking...'
              : 'Tap to initialize voice...'}
          </span>
        </div>

        {/* Right side wave */}
        <div className="flex items-center space-x-1">
          {[5, 9, 16, 7, 14, 8, 4].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all ${
                isListening ? 'bg-emerald-300 animate-pulse' : 'bg-cyan-300'
              }`}
              style={{
                height: isListening ? `${h * 1.5}px` : `${Math.max(h * 0.9, 4)}px`,
              }}
            />
          ))}
        </div>
      </button>

      {/* Decorative waveform divider */}
      <div className="hidden lg:flex items-center space-x-1 px-4 opacity-40">
        {[3, 4, 2, 5, 3, 7, 4, 6, 2, 5, 3, 4, 2].map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-cyan-400"
            style={{ height: `${h * 2.5}px` }}
          />
        ))}
      </div>

      {/* Right: Executive Briefing action button */}
      <div className="flex items-center">
        <button
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all group"
          style={{
            background: 'rgba(8, 20, 44, 0.85)',
            border: '1px solid rgba(0, 247, 255, 0.3)',
            color: '#cbd5e1',
          }}
          title="Executive Briefing Audio/Visual Summary"
        >
          <Play size={14} className="text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm group-hover:text-cyan-300 transition-colors">
            Executive Briefing ▷
          </span>
        </button>
      </div>
    </footer>
  );
}
