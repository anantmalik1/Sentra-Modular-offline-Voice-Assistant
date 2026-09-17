'use client';

import React from 'react';
import { MOCK_TIMELINE } from '../data/mockData';

export default function MissionTimeline() {
  return (
    <div className="hud-panel p-2 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-cyan-400/15">
        <span className="hud-title text-[9.5px]">MISSION TIMELINE</span>
        <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-400/25">
          Today ▼
        </span>
      </div>

      {/* Timeline Task List */}
      <div className="flex flex-col justify-between flex-1 gap-1 min-h-0">
        {MOCK_TIMELINE.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-[8.5px] font-mono p-1 rounded hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center space-x-1.5 truncate">
              <span className="text-slate-500 w-11 flex-shrink-0 text-[7.5px]">
                {item.time}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: item.completed ? '#22c55e' : '#00d9ff',
                  boxShadow: item.completed ? '0 0 4px #22c55e' : '0 0 4px #00d9ff',
                }}
              />
              <span className="text-slate-200 truncate font-medium">
                {item.title}
              </span>
            </div>
            <span
              className="text-[7.5px] px-1.5 py-0.2 rounded flex-shrink-0 ml-1"
              style={{
                color: item.completed ? '#22c55e' : '#64748b',
                background: item.completed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              }}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-0.5 border-t border-cyan-400/10 text-center">
        <button className="text-[8px] font-mono text-cyan-400 hover:underline">
          View Full Schedule ›
        </button>
      </div>
    </div>
  );
}
