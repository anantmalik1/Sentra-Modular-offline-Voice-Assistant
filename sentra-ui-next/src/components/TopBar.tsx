'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Grid, Bell, Settings, User, LogOut, Loader2 } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface TopBarProps {
  onOpenSettings?: () => void;
  onOpenSwitcher?: () => void;
}

export default function TopBar({ onOpenSettings, onOpenSwitcher }: TopBarProps) {
  const { user, logout, activities } = useDashboard();
  const [timeStr, setTimeStr] = useState('11:18:21 am');
  const [dateStr, setDateStr] = useState('Monday, 15 June 2026');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; title: string; detail?: string; type: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

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

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setUnreadNotifications(false); // Clear blue dot badge when opened
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 w-full min-h-[64px] border-b border-[#00d9ff]/20 bg-[#081124]/80 backdrop-blur-md z-20">
      {/* Left: Branding & Status */}
      <div className="flex items-center space-x-4">
        {/* Glowing reticle icon */}
        <div className="flex items-center space-x-2.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-400/80 flex items-center justify-center shadow-[0_0_12px_rgba(0,217,255,0.4)]">
            <div className="w-6 h-6 rounded-full border border-cyan-300 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-black text-[16px] tracking-widest text-cyan-300 leading-none">
              SENTRA
            </span>
            <span className="font-mono text-[13px] tracking-[0.18em] text-slate-400 uppercase leading-tight mt-1">
              COMMAND CENTER
            </span>
          </div>
        </div>

        {/* Center-left: Status Pill */}
        <div className="hidden sm:flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#0a152e]/90 border border-cyan-400/30 text-[14px] font-mono shadow-[0_0_8px_rgba(0,217,255,0.15)]">
          <span className="text-slate-300 font-bold">SYSTEM STATUS</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold text-[14px] tracking-wider">OPTIMAL</span>
        </div>
      </div>

      {/* Center: Live Date + Large Bold Time (36px) */}
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-[15px] text-slate-400 tracking-wider">
          {dateStr}
        </span>
        <span className="font-mono font-bold text-[36px] tracking-widest text-cyan-300 leading-tight drop-shadow-[0_0_12px_rgba(0,217,255,0.7)]">
          {timeStr}
        </span>
      </div>

      {/* Right: Search, Actions, Profile */}
      <div className="flex items-center space-x-3">
        {/* Search bar with functional dropdown */}
        <div className="relative">
          <div className="hidden md:flex items-center px-3.5 py-2 rounded-lg bg-[#0a1630]/80 border border-cyan-400/20 w-48 lg:w-56 focus-within:border-cyan-400 transition-all">
            {isSearching ? (
              <Loader2 size={16} className="text-cyan-400 mr-2 animate-spin flex-shrink-0" />
            ) : (
              <Search size={16} className="text-slate-400 mr-2 flex-shrink-0" />
            )}
            <input
              type="text"
              placeholder="Search tasks, memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[15px] font-mono text-slate-100 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          {/* Search Dropdown */}
          {searchQuery && searchResults.length > 0 && (
            <div
              ref={searchDropdownRef}
              className="absolute top-12 right-0 w-80 bg-[#071124] border border-cyan-400/40 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] z-50 p-3.5 font-mono text-[14px]"
            >
              <div className="text-slate-400 text-[13px] uppercase tracking-wider mb-2 px-1">
                Search Results ({searchResults.length})
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg hover:bg-cyan-950/60 border border-transparent hover:border-cyan-400/30 cursor-pointer flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] text-slate-100 font-bold truncate">{item.title}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                        {item.type}
                      </span>
                    </div>
                    {item.detail && <span className="text-slate-400 text-[13px] truncate mt-0.5">{item.detail}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Functional Utility buttons (Grid Switcher, Notifications Bell, Settings Gear) */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenSwitcher}
            className="p-2.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 hover:border-cyan-400/30 transition-colors cursor-pointer"
            title="Sector Grid Quick-Switcher"
          >
            <Grid size={20} />
          </button>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={handleToggleNotifications}
              className="p-2.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 hover:border-cyan-400/30 relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadNotifications && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d9ff] animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div
                ref={notifDropdownRef}
                className="absolute top-12 right-0 w-80 bg-[#071124] border border-cyan-400/40 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] z-50 p-3.5 font-mono text-[14px]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-400/20">
                  <span className="text-[13px] font-bold text-cyan-300 uppercase tracking-wider">
                    INTELLIGENCE NOTIFICATIONS
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {activities.length} recent
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
                  {activities.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-[13px]">
                      No notifications on record.
                    </div>
                  ) : (
                    activities.slice(0, 6).map((act) => (
                      <div
                        key={act.id}
                        className="p-2 rounded-lg bg-[#0a1834] border border-cyan-400/10 flex flex-col gap-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-slate-200 truncate">{act.title}</span>
                          <span className="text-[10px] px-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                            {act.tag}
                          </span>
                        </div>
                        <span className="text-[12px] text-slate-400 line-clamp-1">{act.description}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/10 hover:border-cyan-400/30 transition-colors cursor-pointer"
            title="Settings / Providers / Profile"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Operator Profile Pill with Working Dropdown & Logout */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center space-x-2 pl-3 py-1 pr-1.5 rounded-full bg-[#0a1630] border border-cyan-400/30 hover:border-cyan-400 cursor-pointer transition-colors"
          >
            <div className="hidden lg:flex flex-col text-right leading-none pr-1">
              <span className="font-mono text-[16px] font-bold text-slate-100">
                {user?.name || 'Operator'}
              </span>
              <span className="font-mono text-[13px] text-cyan-400 uppercase tracking-wider mt-0.5">
                {user?.role || 'Commander'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <User size={18} />
            </div>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute top-12 right-0 w-60 bg-[#071124] border border-cyan-400/40 rounded-xl shadow-[0_8px_30px_rgba(0,217,255,0.3)] p-3 z-50 font-mono">
              <div className="pb-2.5 mb-2.5 border-b border-cyan-400/20">
                <div className="font-bold text-[16px] text-slate-100 truncate">{user?.name || 'Operator'}</div>
                <div className="text-slate-400 text-[14px] truncate mt-0.5">{user?.email || 'commander@sentra.ai'}</div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-950/60 border border-transparent hover:border-rose-500/40 transition-colors text-left cursor-pointer text-[15px] font-bold"
              >
                <LogOut size={18} />
                <span>LOGOUT / EXIT</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}