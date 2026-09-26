'use client';

import React from 'react';
import {
  X,
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
} from 'lucide-react';

interface QuickSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNav: (id: string) => void;
}

const SECTIONS = [
  { id: 'command_center', label: 'Command Center', icon: LayoutDashboard, desc: 'Central Operations HUD & Telemetry', color: '#00d9ff' },
  { id: 'ai_core', label: 'AI Core', icon: Cpu, desc: 'Dual-pipeline Neural Reasoning Architecture', color: '#22c55e' },
  { id: 'agents', label: 'Agents Matrix', icon: Bot, desc: 'Multi-Agent Orchestration & Workers', color: '#a855f7' },
  { id: 'tasks', label: 'Mission Tasks', icon: CheckSquare, desc: 'Task Queue & Scheduled Cron Workers', color: '#3b82f6' },
  { id: 'calendar', label: 'Calendar Planner', icon: Calendar, desc: 'Timeline & Daily Strategic Scheduling', color: '#00d9ff' },
  { id: 'memory', label: 'Vector Memory', icon: Database, desc: 'Cognitive Vectors & Long-Term Recall', color: '#f59e0b' },
  { id: 'conversations', label: 'Transcripts', icon: MessageSquare, desc: 'Voice Logs & Command History', color: '#22c55e' },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, desc: 'Indexed Manuals & Workspace Docs', color: '#a855f7' },
  { id: 'tools', label: 'Tools & Skills', icon: Wrench, desc: 'Hardware, Audio & Browser Protocols', color: '#3b82f6' },
  { id: 'workflows', label: 'Workflows', icon: GitMerge, desc: 'Autonomous Multi-Step DAG Pipelines', color: '#f59e0b' },
];

export default function QuickSwitcherModal({ isOpen, onClose, onSelectNav }: QuickSwitcherModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-6">
      <div className="hud-panel p-6 w-full max-w-2xl border-cyan-400/50 shadow-[0_0_30px_rgba(0,217,255,0.3)] bg-[#071124]/95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <span className="font-mono text-[16px] font-bold text-cyan-300 uppercase tracking-wider block">
                SENTRA QUICK SWITCHER // SECTOR GRID
              </span>
              <span className="font-mono text-[13px] text-slate-400">
                Jump directly to any subsystem workspace
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  onSelectNav(sec.id);
                  onClose();
                }}
                className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-cyan-950/40 transition-all flex items-start space-x-3.5 text-left cursor-pointer group shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    background: `${sec.color}15`,
                    color: sec.color,
                    border: `1px solid ${sec.color}35`,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[16px] font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {sec.label}
                  </span>
                  <span className="font-mono text-[13px] text-slate-400 mt-0.5 line-clamp-1">
                    {sec.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
