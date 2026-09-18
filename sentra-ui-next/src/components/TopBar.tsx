'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Grid, Bell, Settings, User, LogOut, Loader2 } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export default function TopBar({ onOpenSettings }: TopBarProps) {
  const { user, logout } = useDashboard();
  const [timeStr, setTimeStr] = useState('11:18:21 am');
  const [dateStr, setDateStr] = useState('Monday, 15 June 2026');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; title: string; detail?: string; type: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

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

  // Real-time search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
        {/* Search bar with functional dropdown */}
        <div className="relative">
          <div className="hidden md:flex items-center px-2 py-1 rounded-md bg-[#0a1630]/80 border border-cyan-400/20 w-36 lg:w-44 focus-within:border-cyan-400 transition-all">
            {isSearching ? (
              <Loader2 size={11} className="text-cyan-400 mr-1.5 animate-spin flex-shrink-0" />
            ) : (
              <Search size={11} className="text-slate-500 mr-1.5 flex-shrink-0" />
            )}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[10px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none w-full"
            />
          </div>

          {/* Search Dropdown */}
          {searchQuery && searchResults.length > 0 && (
            <div
              ref={searchDropdownRef}
              className="absolute top-8 right-0 w-64 bg-[#071124] border border-cyan-400/40 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.8)] z-50 p-2 font-mono text-[10px]"
            >
              <div className="text-slate-400 text-[8px] uppercase tracking-wider mb-1.5 px-1">
                Search Results ({searchResults.length})
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 rounded hover:bg-cyan-950/50 border border-transparent hover:border-cyan-400/20 cursor-pointer flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-bold truncate">{item.title}</span>
                      <span className="text-[7px] px-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                        {item.type}
                      </span>
                    </div>
                    {item.detail && <span className="text-slate-400 text-[8px] truncate mt-0.5">{item.detail}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Utility buttons */}
        <div className="flex items-center space-x-1">
          <button
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 transition-colors cursor-pointer"
            title="Grid Overview"
          >
            <Grid size={13} />
          </button>
          <button
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={13} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#00d9ff]" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 transition-colors cursor-pointer"
            title="Settings / Providers"
          >
            <Settings size={13} />
          </button>
        </div>

        {/* Operator Profile Pill with Working Dropdown & Logout */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center space-x-1.5 pl-2 py-0.5 pr-1 rounded-full bg-[#0a1630] border border-cyan-400/30 hover:border-cyan-400 cursor-pointer transition-colors"
          >
            <div className="hidden lg:flex flex-col text-right leading-none pr-1">
              <span className="font-mono text-[9px] font-bold text-slate-200">
                {user?.name || 'Operator'}
              </span>
              <span className="font-mono text-[7.5px] text-cyan-400 uppercase tracking-wider">
                {user?.role || 'Commander'}
              </span>
            </div>
            <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <User size={11} />
            </div>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute top-8 right-0 w-48 bg-[#071124] border border-cyan-400/40 rounded-lg shadow-[0_4px_25px_rgba(0,217,255,0.25)] p-2.5 z-50 font-mono text-[10px]">
              <div className="pb-2 mb-2 border-b border-cyan-400/20">
                <div className="font-bold text-slate-200 truncate">{user?.name || 'Operator'}</div>
                <div className="text-slate-400 text-[8px] truncate">{user?.email || 'commander@sentra.ai'}</div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-2 py-1.5 rounded text-rose-300 hover:bg-rose-950/60 border border-transparent hover:border-rose-500/40 transition-colors text-left cursor-pointer"
              >
                <LogOut size={12} />
                <span>TERMINATE SESSION</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
