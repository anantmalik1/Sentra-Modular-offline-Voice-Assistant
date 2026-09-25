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
    <div className="hud-panel p-2 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-cyan-400/15">
        <span className="hud-title text-[9.5px]">ACTIVE AGENTS</span>
        <span className="text-[8px] font-mono text-cyan-400">
          {agents.filter((a) => a.status === 'Active').length} Active
        </span>
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 flex-1 min-h-0">
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
              className="p-1.5 rounded-md bg-[#071124]/75 border border-cyan-400/10 hover:border-cyan-400/30 flex flex-col justify-between transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(0,217,255,0.15)]"
              title="Click to toggle Active / Standby"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${agent.color}15`,
                    color: agent.color,
                  }}
                >
                  <Icon size={11} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[9px] font-bold text-slate-200 truncate leading-tight">
                    {agent.name}
                  </span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? '#22c55e' : '#64748b',
                        boxShadow: isActive ? '0 0 4px #22c55e' : 'none',
                      }}
                    />
                    <span
                      className="font-mono text-[7.5px]"
                      style={{ color: isActive ? '#22c55e' : '#64748b' }}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Progress / Activity Waveform */}
              <div className="flex items-center space-x-0.5 mt-1 h-2 px-0.5">
                {[4, 8, 3, 7, 10, 4, 8, 5, 9, 3].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full transition-all"
                    style={{
                      height: isActive ? `${h}px` : '2px',
                      backgroundColor: isActive ? agent.color : '#334155',
                      opacity: isActive ? 0.8 : 0.4,
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
