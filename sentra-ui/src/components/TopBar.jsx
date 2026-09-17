import React, { useState, useEffect } from 'react';
import { Search, Grid, Bell, Settings, User } from 'lucide-react';

export default function TopBar({
  backendStatus = 'CONNECTED',
  mode = 'OPTIMAL',
  onRefresh,
  onOpenSettings,
}) {
  const [timeStr, setTimeStr] = useState('11:18:21 am');
  const [dateStr, setDateStr] = useState('Monday, 15 June 2026');

  useEffect(() => {
    const updateTime = () => {
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
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = backendStatus === 'CONNECTED';

  return (
    <header className="flex items-center justify-between px-4 py-3 w-full border border-cyan-400/25 bg-[#081124]/90 backdrop-blur-md rounded-xl shadow-[0_0_15px_rgba(0,217,255,0.1)]">
      {/* Left: SYSTEM STATUS • OPTIMAL pill */}
      <div className="flex items-center space-x-3">
        <div
          onClick={onRefresh}
          className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full cursor-pointer transition-all bg-[#0a1834] border border-cyan-400/35 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,217,255,0.2)]"
          title="Click to refresh telemetry"
        >
          <span className="font-mono text-xs tracking-wider uppercase font-bold text-slate-200">
            SYSTEM STATUS
          </span>
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: isOnline ? '#00ff88' : '#ff3355',
              boxShadow: isOnline ? '0 0 10px #00ff88' : '0 0 10px #ff3355',
            }}
          />
          <span
            className="font-mono text-xs tracking-wider uppercase font-bold"
            style={{ color: isOnline ? '#00ff88' : '#ff3355' }}
          >
            {isOnline ? 'OPTIMAL' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Center: Date + Live Clock (increased to ~34px) */}
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <div className="font-mono text-xs text-slate-400 tracking-wider">
          {dateStr}
        </div>
        <div
          className="font-mono font-black tracking-widest text-3xl sm:text-4xl leading-none mt-1 text-cyan-300 drop-shadow-[0_0_16px_rgba(0,217,255,0.85)]"
        >
          {timeStr}
        </div>
      </div>

      {/* Right: Search + Icon buttons + Operator Commander */}
      <div className="flex items-center space-x-3">
        {/* Search input */}
        <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-[#0a1834] border border-cyan-400/25 w-44 lg:w-52 transition-all focus-within:border-cyan-400">
          <Search size={15} className="text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm font-mono focus:outline-none w-full text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          <button
            className="p-2 rounded-lg hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 transition-colors border border-cyan-400/20"
            title="Overview"
          >
            <Grid size={16} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 transition-colors border border-cyan-400/20 relative"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f7ff]" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 transition-colors border border-cyan-400/20"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Operator Badge */}
        <div className="flex items-center space-x-2 pl-3 py-1 pr-2 rounded-full bg-[#0a1834] border border-cyan-400/35">
          <div className="flex flex-col text-right leading-tight pr-1">
            <span className="font-mono text-xs font-bold text-slate-200">
              Operator
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase text-cyan-400 font-semibold">
              Commander
            </span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-cyan-950 border border-cyan-400 text-cyan-300">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
