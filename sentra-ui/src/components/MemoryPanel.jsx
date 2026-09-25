import React from 'react';

export default function MemoryPanel({ memoryCount = 3380 }) {
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
    <div className="hud-panel p-5 flex flex-col justify-between h-full w-full">
      <div className="hud-panel-title pb-2 border-b border-cyan-500/20 mb-2 text-sm font-bold">
        MEMORY INSIGHTS
      </div>

      <div className="flex items-center justify-between flex-1 gap-3 min-h-[90px]">
        {/* Constellation SVG Graph */}
        <div className="relative flex-1 h-full min-h-[70px] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 65" preserveAspectRatio="none">
            {lines.map(([p1, p2], idx) => (
              <line
                key={idx}
                x1={points[p1].x}
                y1={points[p1].y}
                x2={points[p2].x}
                y2={points[p2].y}
                stroke="rgba(0, 247, 255, 0.45)"
                strokeWidth="1"
              />
            ))}
            {points.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="2.2"
                fill="#00f7ff"
                style={{ filter: 'drop-shadow(0 0 3px #00f7ff)' }}
              />
            ))}
          </svg>
        </div>

        {/* Stats Column: 17-18px values */}
        <div className="flex flex-col justify-center text-right space-y-2 flex-shrink-0 min-w-[95px]">
          <div>
            <div className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Memories</div>
            <div className="font-mono text-[18px] font-black text-slate-100 leading-tight">
              {memoryCount.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Session Turns</div>
            <div className="font-mono text-[16px] font-bold text-slate-100 leading-tight">
              22
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Tool Calls</div>
            <div className="font-mono text-[16px] font-bold text-slate-100 leading-tight">
              14
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-cyan-500/15 text-center mt-1">
        <button className="text-xs font-mono text-cyan-400 hover:underline font-medium">
          View Memory Map ›
        </button>
      </div>
    </div>
  );
}
