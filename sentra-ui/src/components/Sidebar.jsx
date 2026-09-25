import React from 'react';
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
import VoiceVisualizer from './VoiceVisualizer';

const NAV_ITEMS = [
  { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
  { id: 'ai_core', label: 'AI Core', icon: Cpu },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, badgeKey: 'tasks' },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'memory', label: 'Memory', icon: Database },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare, badgeKey: 'conversations' },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { id: 'tools', label: 'Tools & Skills', icon: Wrench, badgeKey: 'tools' },
  { id: 'workflows', label: 'Workflows', icon: GitMerge },
];

export default function Sidebar({
  activeNav = 'command_center',
  onSelectNav,
  state = 'IDLE',
  audioLevel = 0,
  onToggleVoice,
  badgeCounts = { tasks: 3, conversations: 12, tools: 18 },
}) {
  const isListening = state === 'LISTENING';
  const isSpeaking = state === 'SPEAKING';

  return (
    <aside className="hud-panel p-4 flex flex-col justify-between w-full h-full min-w-[260px]">
      {/* 1. Header Branding */}
      <div>
        <div className="flex items-center space-x-3 pb-3.5 mb-3 border-b border-cyan-500/20">
          {/* Hologram Reticle Logo */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0"
            style={{
              background: 'radial-gradient(circle, rgba(0,247,255,0.25) 0%, rgba(4,10,24,0.9) 80%)',
              border: '1.5px solid #00f7ff',
              boxShadow: '0 0 14px rgba(0,247,255,0.35)',
            }}
          >
            <div className="w-5 h-5 rounded-full border border-cyan-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-base font-black tracking-widest text-cyan-300 leading-none">
              SENTRA
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase leading-tight mt-1">
              AI COMMAND CENTER
            </span>
          </div>
        </div>

        {/* 2. Navigation Items with dynamic active highlighting & dynamic badge counts */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            const badgeValue = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;

            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-[15px] font-mono transition-all flex-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/85 border-l-4 border-l-cyan-400 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,247,255,0.25)] font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 truncate">
                  <Icon size={20} className={isActive ? 'text-cyan-400 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                </div>
                {badgeValue !== undefined && (
                  <span
                    className="font-mono text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-2"
                    style={{
                      background: 'rgba(0, 136, 255, 0.25)',
                      color: '#00f7ff',
                      border: '1px solid rgba(0, 247, 255, 0.35)',
                    }}
                  >
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Bottom Voice Status HUD Card */}
      <div
        className="p-3.5 rounded-xl flex flex-col items-center relative overflow-hidden mt-4"
        style={{
          background: 'rgba(6, 14, 32, 0.85)',
          border: '1px solid rgba(0, 247, 255, 0.25)',
        }}
      >
        {/* Voice status title */}
        <div className="flex items-center justify-between w-full mb-1.5">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs font-mono">
            VOICE STATUS
          </span>
          <span className="text-slate-400 text-sm">›</span>
        </div>

        {/* Live Audio Waveform (reactive to actual mic AnalyserNode) */}
        <div className="w-full my-1.5">
          <VoiceVisualizer state={state} audioLevel={audioLevel} />
        </div>

        {/* Status text */}
        <div className="font-mono text-sm text-slate-300 mb-2">
          {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : state}
        </div>

        {/* Circular Microphone Button */}
        <div className="relative my-1.5">
          <div
            className={`absolute -inset-2 rounded-full transition-all duration-300 pointer-events-none ${
              isListening
                ? 'border-2 border-emerald-400 animate-ping opacity-60'
                : 'border border-cyan-500/20'
            }`}
          />
          <button
            onClick={onToggleVoice}
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center relative z-10 transition-all cursor-pointer ${
              isListening
                ? 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(0,255,136,0.6)]'
                : 'bg-cyan-950/70 border border-cyan-400 text-cyan-300 hover:shadow-[0_0_18px_rgba(0,247,255,0.45)]'
            }`}
            title="Tap to speak with Sentra (Web Speech API)"
          >
            <Mic size={22} />
          </button>
        </div>

        {/* Tap to speak label */}
        <div className="font-mono text-xs text-slate-400 mt-1 uppercase tracking-wider">
          Tap to Speak
        </div>

        {/* Focus Mode button */}
        <button
          className="flex items-center justify-center space-x-2 w-full py-1.5 mt-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 hover:text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
        >
          <Crosshair size={14} className="text-cyan-400" />
          <span>Focus Mode</span>
        </button>
      </div>
    </aside>
  );
}
