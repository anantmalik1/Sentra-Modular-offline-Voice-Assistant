'use client';

import React, { useState, useEffect } from 'react';
import { Search, Grid, Bell, Settings, User } from 'lucide-react';

export default function TopBar() {
  const [timeStr, setTimeStr] = useState('11:18:21 am');
  const [dateStr, setDateStr] = useState('Monday, 15 June 2026');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).toLowerCase()
      );
      setDateStr(
        now.toLocaleDateString([], {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-3 py-1.5 w-full h-[46px] border-b border-[#00d9ff]/20 bg-[#081124]/80 backdrop-blur-md z-20">
      {/* Left: Branding & Status */}
      <div className="flex items-center space-x-3">
        {/* Glowing reticle icon */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/80 flex items-center justify-center shadow-[0_0_12px_rgba(0,217,255,0.4)]">
            <div className="w-3.5 h-3.5 rounded-full border border-cyan-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-black text-xs tracking-widest text-cyan-300 leading-none">
              SENTRA
            </span>
            <span className="font-mono text-[7.5px] tracking-[0.18em] text-slate-400 uppercase leading-tight mt-0.5">
              COMMAND CENTER
            </span>
          </div>
        </div>

        {/* Center-left: Status Pill */}
        <div className="hidden sm:flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#0a152e]/90 border border-cyan-400/30 text-[10px] font-mono shadow-[0_0_8px_rgba(0,217,255,0.15)]">
          <span className="text-slate-300 font-bold">SYSTEM STATUS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold tracking-wider">OPTIMAL</span>
        </div>
      </div>

      {/* Center: Live Date + Large Bold Time */}
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-[9px] text-slate-400 tracking-wider">
          {dateStr}
        </span>
        <span className="font-mono font-bold text-sm sm:text-base tracking-widest text-cyan-300 leading-tight drop-shadow-[0_0_10px_rgba(0,217,255,0.7)]">
          {timeStr}
        </span>
      </div>

      {/* Right: Search, Actions, Profile */}
      <div className="flex items-center space-x-2">
        {/* Search bar */}
        <div className="hidden md:flex items-center px-2 py-1 rounded-md bg-[#0a1630]/80 border border-cyan-400/20 w-36 lg:w-44 focus-within:border-cyan-400 transition-all">
          <Search size={11} className="text-slate-500 mr-1.5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-[10px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none w-full"
          />
        </div>

        {/* Utility buttons */}
        <div className="flex items-center space-x-1">
          <button
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 transition-colors"
            title="Grid Overview"
          >
            <Grid size={13} />
          </button>
          <button
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 relative transition-colors"
            title="Notifications"
          >
            <Bell size={13} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#00d9ff]" />
          </button>
          <button
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 transition-colors"
            title="Settings"
          >
            <Settings size={13} />
          </button>
        </div>

        {/* Operator Profile */}
        <div className="flex items-center space-x-1.5 pl-2 py-0.5 pr-1 rounded-full bg-[#0a1630] border border-cyan-400/30">
          <div className="hidden lg:flex flex-col text-right leading-none pr-1">
            <span className="font-mono text-[9px] font-bold text-slate-200">
              Operator
            </span>
            <span className="font-mono text-[7.5px] text-cyan-400 uppercase tracking-wider">
              Commander
            </span>
          </div>
          <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <User size={11} />
          </div>
        </div>
      </div>
    </header>
  );
}
