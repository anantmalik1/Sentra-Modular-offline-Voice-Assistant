import React from 'react';
import { Cpu, Database, Radio, Bot, Sparkles, Activity } from 'lucide-react';

export default function CoreOverview({
  memoryCount = 3380,
  voiceStatus = 'Online',
  aiBrainStatus = '4 Connected',
  systemStatus = 'Optimal',
  activeAgentsCount = 2,
}) {
  const items = [
    {
      title: 'AI Core',
      value: 'Active',
      icon: Cpu,
      color: '#00f7ff',
    },
    {
      title: 'Memory',
      value: `${memoryCount.toLocaleString()} Stored`,
      icon: Database,
      color: '#00f7ff',
    },
    {
      title: 'Voice',
      value: voiceStatus,
      icon: Radio,
      color: '#00ff88',
    },
    {
      title: 'Agents',
      value: `${activeAgentsCount} Running`,
      icon: Bot,
      color: '#9d4edd',
    },
    {
      title: 'LLMs',
      value: aiBrainStatus,
      icon: Sparkles,
      color: '#ffaa00',
    },
    {
      title: 'System',
      value: systemStatus,
      icon: Activity,
      color: '#00ff88',
    },
  ];

  return (
    <div className="hud-panel p-5 flex flex-col justify-between h-full w-full">
      <div className="hud-panel-title pb-2.5 border-b border-cyan-500/20 mb-3 text-sm font-bold">
        AI CORE OVERVIEW
      </div>

      <div className="flex flex-col justify-between flex-1 gap-2.5">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-3 p-2.5 rounded-lg transition-all"
              style={{
                background: 'rgba(6, 14, 32, 0.85)',
                border: '1px solid rgba(0, 247, 255, 0.15)',
              }}
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(0, 247, 255, 0.15)',
                  color: it.color,
                }}
              >
                <Icon size={16} />
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-mono text-[14px] text-slate-200 font-semibold truncate">
                  {it.title}
                </span>
                <span
                  className="font-mono text-[15px] font-bold mt-0.5 truncate"
                  style={{ color: it.color }}
                >
                  {it.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
