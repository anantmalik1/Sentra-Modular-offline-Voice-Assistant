'use client';

import React from 'react';
import { MapPin, CloudSun, Wifi, Play } from 'lucide-react';

interface BottomBarProps {
  isListening: boolean;
  onToggleMic: () => void;
  location?: string;
  weather?: string;
  network?: string;
}

export default function BottomBar({
  isListening,
  onToggleMic,
  location = 'Bhimber, Pak...',
  weather = '28°C Overcast',
  network = 'Excellent',
}: BottomBarProps) {
  return (
    <footer className="flex items-center justify-between px-3 py-1.5 w-full h-[48px] border-t border-cyan-400/20 bg-[#081124]/85 backdrop-blur-md z-20">
      {/* Left: Location + Weather + Network status chips */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[#0a1834]/80 border border-cyan-400/15 text-[8.5px] font-mono">
          <MapPin size={10} className="text-cyan-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[6.5px] text-slate-500 uppercase">Location</span>
            <span className="text-slate-200 font-semibold">{location}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[#0a1834]/80 border border-cyan-400/15 text-[8.5px] font-mono">
          <CloudSun size={10} className="text-amber-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[6.5px] text-slate-500 uppercase">Weather</span>
            <span className="text-slate-200 font-semibold">{weather}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[#0a1834]/80 border border-cyan-400/15 text-[8.5px] font-mono">
          <Wifi size={10} className="text-emerald-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[6.5px] text-slate-500 uppercase">Network</span>
            <span className="text-emerald-400 font-bold">{network}</span>
          </div>
        </div>
      </div>

      {/* Decorative waveform divider */}
      <div className="hidden lg:flex items-center space-x-1 px-4 opacity-40">
        {[2, 4, 3, 6, 2, 7, 4, 8, 3, 5, 2, 4].map((h, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-cyan-400"
            style={{ height: `${h * 1.8}px` }}
          />
        ))}
      </div>

      {/* Center: Glowing pill-shaped "TALK TO SENTRA" button */}
      <button
        onClick={onToggleMic}
        className="flex items-center space-x-3 px-5 py-1 rounded-full cursor-pointer transition-all group relative"
        style={{
          background: isListening
            ? 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.25) 0%, rgba(6, 20, 36, 0.95) 80%)'
            : 'radial-gradient(ellipse at center, rgba(0, 217, 255, 0.2) 0%, rgba(6, 18, 40, 0.95) 80%)',
          border: isListening ? '1.5px solid #22c55e' : '1.5px solid #00d9ff',
          boxShadow: isListening
            ? '0 0 25px rgba(34, 197, 94, 0.5), inset 0 0 10px rgba(34, 197, 94, 0.3)'
            : '0 0 18px rgba(0, 217, 255, 0.35), inset 0 0 8px rgba(0, 217, 255, 0.2)',
          minWidth: '220px',
        }}
        title="Tap to speak with Sentra"
      >
        {/* Left Waveform animation */}
        <div className="flex items-center space-x-0.5">
          {[3, 6, 11, 5, 12, 7, 4].map((h, i) => (
            <div
              key={i}
              className={`w-0.5 rounded-full transition-all ${
                isListening ? 'bg-emerald-300 animate-pulse' : 'bg-cyan-300'
              }`}
              style={{
                height: isListening ? `${h * 1.4}px` : `${Math.max(h * 0.75, 3)}px`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center flex-1 leading-none">
          <span
            className="font-mono font-black text-[11px] tracking-widest uppercase transition-colors"
            style={{
              color: isListening ? '#22c55e' : '#00d9ff',
              textShadow: isListening
                ? '0 0 8px rgba(34, 197, 94, 0.8)'
                : '0 0 8px rgba(0, 217, 255, 0.8)',
            }}
          >
            TALK TO SENTRA
          </span>
          <span className="font-mono text-[7.5px] text-slate-400 mt-0.5">
            {isListening ? 'I am listening...' : 'Tap to initialize voice...'}
          </span>
        </div>

        {/* Right Waveform animation */}
        <div className="flex items-center space-x-0.5">
          {[4, 7, 12, 5, 11, 6, 3].map((h, i) => (
            <div
              key={i}
              className={`w-0.5 rounded-full transition-all ${
                isListening ? 'bg-emerald-300 animate-pulse' : 'bg-cyan-300'
              }`}
              style={{
                height: isListening ? `${h * 1.4}px` : `${Math.max(h * 0.75, 3)}px`,
              }}
            />
          ))}
        </div>
      </button>

      {/* Decorative waveform divider */}
      <div className="hidden lg:flex items-center space-x-1 px-4 opacity-40">
        {[3, 5, 2, 6, 4, 7, 3, 5, 2, 4].map((h, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-cyan-400"
            style={{ height: `${h * 1.8}px` }}
          />
        ))}
      </div>

      {/* Right: Executive Briefing button */}
      <div className="flex items-center">
        <button
          className="flex items-center space-x-1.5 px-3 py-1 rounded-md text-[8.5px] font-mono bg-[#0a1834] border border-cyan-400/25 text-slate-200 hover:text-cyan-300 hover:border-cyan-400/50 transition-all cursor-pointer group"
          title="Executive Briefing summary"
        >
          <Play size={10} className="text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Executive Briefing ▷</span>
        </button>
      </div>
    </footer>
  );
}
