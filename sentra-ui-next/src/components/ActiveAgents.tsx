'use client';

import React from 'react';
import { Code2, Search, Database, Globe, CheckSquare, Terminal } from 'lucide-react';
import { MOCK_AGENTS } from '../data/mockData';

const ICONS = [Code2, Search, Database, Globe, CheckSquare, Terminal];

export default function ActiveAgents() {
  return (
    <div className="hud-panel p-2 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-cyan-400/15">
        <span className="hud-title text-[9.5px]">ACTIVE AGENTS</span>
        <button className="text-[8.5px] font-mono text-cyan-400 hover:underline">
          View All ›
        </button>
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 flex-1 min-h-0">
        {MOCK_AGENTS.map((agent, idx) => {
          const Icon = ICONS[idx % ICONS.length];
          const isActive = agent.status === 'Active';

          return (
            <div
              key={agent.id}
              className="p-1.5 rounded-md bg-[#071124]/75 border border-cyan-400/10 hover:border-cyan-400/30 flex flex-col justify-between transition-all"
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
