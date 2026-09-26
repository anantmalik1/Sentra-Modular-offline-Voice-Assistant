'use client';

import React from 'react';
import { Code2, Search, Database, Globe, CheckSquare, Terminal } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { Agent } from '@/types/dashboard';

const ICONS: Record<string, React.ElementType> = {
  coding: Code2,
  research: Search,
  memory: Database,
  browser: Globe,
  task: CheckSquare,
  system: Terminal,
};

interface ActiveAgentsProps {
  onSelectAgent?: (agent: Agent) => void;
}

export default function ActiveAgents({ onSelectAgent }: ActiveAgentsProps) {
  const { agents, toggleAgent } = useDashboard();

  return (
    <div className="hud-panel p-6 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-400/15">
        <span className="hud-title">ACTIVE AGENTS</span>
        <span className="text-[18px] font-mono font-bold text-cyan-400">
          {agents.filter((a) => a.status === 'Active').length} Active
        </span>
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3 flex-1 min-h-0">
        {agents.map((agent) => {
          const Icon = ICONS[agent.id] || Code2;
          const isActive = agent.status === 'Active';

          return (
            <div
              key={agent.id}
              onClick={() => {
                if (onSelectAgent) {
                  onSelectAgent(agent);
                } else {
                  toggleAgent(agent.id);
                }
              }}
              className="p-3 rounded-lg bg-[#071124]/75 border border-cyan-400/10 hover:border-cyan-400/30 flex flex-col justify-between transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(0,217,255,0.15)]"
              title="Click to toggle Active / Standby"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${agent.color}18`,
                    color: agent.color,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[16px] font-bold text-slate-200 truncate leading-tight">
                    {agent.name}
                  </span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? '#22c55e' : '#64748b',
                        boxShadow: isActive ? '0 0 4px #22c55e' : 'none',
                      }}
                    />
                    <span
                      className="font-mono text-[15px] font-medium"
                      style={{ color: isActive ? '#22c55e' : '#94a3b8' }}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Progress / Activity Waveform */}
              <div className="flex items-center space-x-1 mt-2 h-3 px-1">
                {[4, 8, 3, 7, 10, 4, 8, 5, 9, 3].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full transition-all"
                    style={{
                      height: isActive ? `${h + 1}px` : '3px',
                      backgroundColor: isActive ? agent.color : '#334155',
                      opacity: isActive ? 0.85 : 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
