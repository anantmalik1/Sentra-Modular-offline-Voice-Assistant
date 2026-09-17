'use client';

import React from 'react';
import { Cpu, Database, Radio, Bot, Sparkles, Activity } from 'lucide-react';
import { MOCK_CORE_OVERVIEW } from '../data/mockData';

const ICONS = [Cpu, Database, Radio, Bot, Sparkles, Activity];

export default function AICoreOverview() {
  return (
    <div className="hud-panel p-2 flex flex-col justify-between h-full w-[185px] flex-shrink-0">
      <div className="hud-title pb-1 border-b border-cyan-400/15 mb-1 text-[9.5px]">
        AI CORE OVERVIEW
      </div>

      <div className="flex flex-col justify-between flex-1 gap-1 min-h-0">
        {MOCK_CORE_OVERVIEW.map((item, idx) => {
          const Icon = ICONS[idx % ICONS.length];
          return (
            <div
              key={idx}
              className="flex items-center space-x-2 p-1.5 rounded-md bg-[#071124]/75 border border-cyan-400/10 hover:border-cyan-400/30 transition-all"
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${item.color}15`,
                  color: item.color,
                }}
              >
                <Icon size={11} />
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-mono text-[9px] text-slate-300 font-semibold truncate">
                  {item.label}
                </span>
                <span
                  className="font-mono text-[8px] font-bold truncate"
                  style={{ color: item.color }}
                >
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
