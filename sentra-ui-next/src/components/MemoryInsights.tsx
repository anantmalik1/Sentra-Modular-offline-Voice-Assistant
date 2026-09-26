'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function MemoryInsights() {
  const { memoryStats } = useDashboard();

  const points = [
    { x: 12, y: 38 },
    { x: 28, y: 22 },
    { x: 45, y: 44 },
    { x: 62, y: 18 },
    { x: 78, y: 32 },
    { x: 92, y: 20 },
    { x: 35, y: 55 },
    { x: 70, y: 52 },
  ];

  const lines = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [1, 6], [2, 6], [3, 7], [4, 7]
  ];

  return (
    <div className="hud-panel p-6 flex flex-col justify-between h-full w-full">
      <div className="hud-title pb-2 border-b border-cyan-400/15 mb-2">
        MEMORY INSIGHTS
      </div>

      <div className="flex items-center justify-between flex-1 gap-4 min-h-0">
        {/* Constellation Activity Map */}
        <div className="relative flex-1 h-full min-h-[60px] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 65" preserveAspectRatio="none">
            {lines.map(([p1, p2], idx) => (
              <line
                key={idx}
                x1={points[p1].x}
                y1={points[p1].y}
                x2={points[p2].x}
                y2={points[p2].y}
                stroke="rgba(0, 217, 255, 0.4)"
                strokeWidth="0.8"
              />
            ))}
            {points.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="2"
                fill="#00d9ff"
                style={{ filter: 'drop-shadow(0 0 4px #00d9ff)' }}
              />
            ))}
          </svg>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col justify-center text-right space-y-2 flex-shrink-0 min-w-[90px]">
          <div>
            <div className="font-mono text-[14px] text-slate-400 uppercase">Memories</div>
            <div className="font-mono text-[19px] font-bold text-slate-100 leading-tight">
              {memoryStats.memories.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="font-mono text-[14px] text-slate-400 uppercase">Session Turns</div>
            <div className="font-mono text-[19px] font-bold text-slate-100 leading-tight">
              {memoryStats.sessionTurns}
            </div>
          </div>
          <div>
            <div className="font-mono text-[14px] text-slate-400 uppercase">Tool Calls</div>
            <div className="font-mono text-[19px] font-bold text-slate-100 leading-tight">
              {memoryStats.toolCalls}
            </div>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-1.5 border-t border-cyan-400/10 text-center mt-1">
        <button className="text-[14px] font-mono text-cyan-400 hover:underline cursor-pointer">
          View Memory Map ›
        </button>
      </div>
    </div>
  );
}
