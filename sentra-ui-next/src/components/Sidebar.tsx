'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Cpu,
  Bot,
  CheckSquare,
  Calendar,
  Database,
  MessageSquare,
  BookOpen,
  Wrench,
  GitMerge,
  Mic,
  Crosshair,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
  { id: 'ai_core', label: 'AI Core', icon: Cpu },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: 3 },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'memory', label: 'Memory', icon: Database },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare, badge: 12 },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { id: 'tools', label: 'Tools & Skills', icon: Wrench, badge: 18 },
  { id: 'workflows', label: 'Workflows', icon: GitMerge },
];

interface SidebarProps {
  activeNav: string;
  onSelectNav: (id: string) => void;
  isListening: boolean;
  onToggleMic: () => void;
}

export default function Sidebar({
  activeNav,
  onSelectNav,
  isListening,
  onToggleMic,
}: SidebarProps) {
  return (
    <aside className="hud-panel p-2 flex flex-col justify-between h-full w-[210px] flex-shrink-0">
      {/* 1. Navigation items */}
      <nav className="space-y-0.5 overflow-y-auto pr-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectNav(item.id)}
              className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-[10.5px] font-mono transition-all ${
                isActive
                  ? 'bg-cyan-950/70 border-l-2 border-l-cyan-400 border border-cyan-400/30 text-cyan-300 shadow-[0_0_10px_rgba(0,217,255,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <Icon size={13} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="font-mono text-[8.5px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/20 text-cyan-400 border border-cyan-400/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 2. Bottom VOICE STATUS HUD Card */}
      <div className="p-2 rounded-lg bg-[#071022]/90 border border-cyan-400/25 flex flex-col items-center mt-2 relative">
        <div className="flex items-center justify-between w-full mb-1">
          <span className="font-mono text-[8.5px] font-bold text-cyan-400 tracking-wider uppercase">
            VOICE STATUS
          </span>
          <span className="text-[10px] text-slate-500">›</span>
        </div>

        {/* Animated Audio Waveform Bars */}
        <div className="flex items-center justify-center space-x-1 w-full h-6 my-1">
          {[4, 10, 16, 8, 20, 12, 6, 18, 14, 8, 16, 6].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isListening
                  ? 'bg-emerald-400 animate-pulse shadow-[0_0_4px_#22c55e]'
                  : 'bg-cyan-400/50'
              }`}
              style={{
                height: isListening ? `${Math.max(h * 1.2, 4)}px` : `${Math.max(h * 0.4, 3)}px`,
              }}
            />
          ))}
        </div>

        <span className="font-mono text-[9px] text-slate-400 mb-1.5">
          {isListening ? 'Listening...' : 'Idle Standby'}
        </span>

        {/* Large Circular Glowing Mic Button */}
        <div className="relative my-1">
          <div
            className={`absolute -inset-2 rounded-full transition-all ${
              isListening
                ? 'border-2 border-emerald-400 animate-ping opacity-75'
                : 'border border-cyan-400/20'
            }`}
          />
          <button
            onClick={onToggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative z-10 cursor-pointer ${
              isListening
                ? 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(34,197,94,0.7)]'
                : 'bg-cyan-950/80 border border-cyan-400 text-cyan-300 hover:shadow-[0_0_15px_rgba(0,217,255,0.4)]'
            }`}
            title="Tap to speak"
          >
            <Mic size={18} />
          </button>
        </div>

        <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 mt-1">
          Tap to Speak
        </span>

        {/* Focus Mode Button */}
        <button className="flex items-center justify-center space-x-1.5 w-full py-1 mt-2 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-300 text-[9.5px] font-mono transition-colors">
          <Crosshair size={11} className="text-cyan-400" />
          <span>Focus Mode</span>
        </button>
      </div>
    </aside>
  );
}
