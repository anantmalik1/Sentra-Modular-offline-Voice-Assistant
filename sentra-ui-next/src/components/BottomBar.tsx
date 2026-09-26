'use client';

import React, { useState } from 'react';
import { MapPin, CloudSun, Wifi, Play, Info } from 'lucide-react';

interface BottomBarProps {
  isListening: boolean;
  onToggleMic: () => void;
  onOpenBriefing?: () => void;
  location?: string;
  weather?: string;
  network?: string;
}

export default function BottomBar({
  isListening,
  onToggleMic,
  onOpenBriefing,
  location = 'Bhimber, Pak...',
  weather = '28°C Overcast',
  network = 'Excellent',
}: BottomBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <footer className="flex items-center justify-between px-6 py-4 w-full min-h-[64px] border-t border-cyan-400/20 bg-[#081124]/85 backdrop-blur-md z-20">
      {/* Left: Location + Weather + Network status chips */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#0a1834]/80 border border-cyan-400/15 text-[15px] font-mono">
          <MapPin size={16} className="text-cyan-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] text-slate-500 uppercase">Location</span>
            <span className="text-slate-200 font-semibold">{location}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#0a1834]/80 border border-cyan-400/15 text-[15px] font-mono">
          <CloudSun size={16} className="text-amber-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] text-slate-500 uppercase">Weather</span>
            <span className="text-slate-200 font-semibold">{weather}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#0a1834]/80 border border-cyan-400/15 text-[15px] font-mono">
          <Wifi size={16} className="text-emerald-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] text-slate-500 uppercase">Network</span>
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
            style={{ height: `${h * 2}px` }}
          />
        ))}
      </div>

      {/* Center: Glowing pill-shaped "TALK TO SENTRA" button with info tooltip */}
      <div className="relative flex items-center">
        <button
          onClick={onToggleMic}
          className="flex items-center space-x-4 px-6 py-2 rounded-full cursor-pointer transition-all group relative"
          style={{
            background: isListening
              ? 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.25) 0%, rgba(6, 20, 36, 0.95) 80%)'
              : 'radial-gradient(ellipse at center, rgba(0, 217, 255, 0.2) 0%, rgba(6, 18, 40, 0.95) 80%)',
            border: isListening ? '1.5px solid #22c55e' : '1.5px solid #00d9ff',
            boxShadow: isListening
              ? '0 0 25px rgba(34, 197, 94, 0.5), inset 0 0 10px rgba(34, 197, 94, 0.3)'
              : '0 0 18px rgba(0, 217, 255, 0.35), inset 0 0 8px rgba(0, 217, 255, 0.2)',
            minWidth: '260px',
          }}
          title="Tap to speak with Sentra"
        >
          {/* Left Waveform animation */}
          <div className="flex items-center space-x-1">
            {[3, 6, 11, 5, 12, 7, 4].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all ${
                  isListening ? 'bg-emerald-300 animate-pulse' : 'bg-cyan-300'
                }`}
                style={{
                  height: isListening ? `${h * 1.5}px` : `${Math.max(h * 0.8, 4)}px`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col items-center flex-1 leading-none">
            <span
              className="font-mono font-black text-[15px] tracking-widest uppercase transition-colors"
              style={{
                color: isListening ? '#22c55e' : '#00d9ff',
                textShadow: isListening
                  ? '0 0 8px rgba(34, 197, 94, 0.8)'
                  : '0 0 8px rgba(0, 217, 255, 0.8)',
              }}
            >
              TALK TO SENTRA
            </span>
            <span className="font-mono text-[13px] text-slate-400 mt-1">
              {isListening ? 'I am listening...' : 'Tap to initialize voice...'}
            </span>
          </div>

          {/* Right Waveform animation */}
          <div className="flex items-center space-x-1">
            {[4, 7, 12, 5, 11, 6, 3].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all ${
                  isListening ? 'bg-emerald-300 animate-pulse' : 'bg-cyan-300'
                }`}
                style={{
                  height: isListening ? `${h * 1.5}px` : `${Math.max(h * 0.8, 4)}px`,
                }}
              />
            ))}
          </div>
        </button>

        {/* Browser capabilities info button & tooltip */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-1 rounded-full text-slate-500 hover:text-cyan-300 hover:bg-cyan-950/60 transition-colors cursor-pointer"
            aria-label="Browser capabilities info"
          >
            <Info size={16} />
          </button>

          {showTooltip && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 p-3 rounded-xl bg-[#061226] border border-cyan-400/40 text-xs font-mono text-slate-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-50 pointer-events-none">
              <div className="font-bold text-cyan-300 uppercase mb-1 flex items-center space-x-1.5">
                <span>⚡ Execution Environment</span>
              </div>
              <p className="leading-relaxed text-slate-300">
                SENTRA supports dual-mode operation:
                <br />• <span className="text-cyan-300 font-bold">Electron Desktop:</span> Real OS command execution, launch desktop apps (Spotify, WhatsApp, Notepad), and pywhatkit automation.
                <br />• <span className="text-cyan-300 font-bold">Web Browser:</span> Dispatches web tabs, Google searches, and WhatsApp Web wa.me links.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decorative waveform divider */}
      <div className="hidden lg:flex items-center space-x-1 px-4 opacity-40">
        {[3, 5, 2, 6, 4, 7, 3, 5, 2, 4].map((h, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-cyan-400"
            style={{ height: `${h * 2}px` }}
          />
        ))}
      </div>

      {/* Right: Executive Briefing button */}
      <div className="flex items-center">
        <button
          onClick={onOpenBriefing}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-[15px] font-mono bg-[#0a1834] border border-cyan-400/25 text-slate-200 hover:text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-950/50 transition-all cursor-pointer group shadow-[0_0_10px_rgba(0,217,255,0.15)]"
          title="Open Executive Briefing Summary"
        >
          <Play size={16} className="text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Executive Briefing ▷</span>
        </button>
      </div>
    </footer>
  );
}
