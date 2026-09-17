import React from 'react';
import { AlertTriangle, Info, Sparkles } from 'lucide-react';

export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="hud-panel p-5 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <span className="hud-panel-title text-sm">LIVE INTELLIGENCE FEED</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-emerald-300 font-bold">LIVE</span>
        </div>
      </div>

      {/* Real-time Dynamic Feed List */}
      <div className="flex flex-col justify-between flex-1 gap-2.5 min-h-0 overflow-y-auto pr-1">
        {activities.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl flex items-start space-x-3 transition-all"
            style={{
              background: 'rgba(6, 14, 32, 0.85)',
              border: '1px solid rgba(0, 247, 255, 0.15)',
            }}
          >
            {/* Tag / Icon indicator */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: `${item.color || '#00f7ff'}15`,
                color: item.color || '#00f7ff',
                border: `1px solid ${item.color || '#00f7ff'}40`,
              }}
            >
              {item.type === 'WARN' ? (
                <AlertTriangle size={15} />
              ) : item.type === 'VOICE' ? (
                <Sparkles size={15} />
              ) : (
                <Info size={15} />
              )}
            </div>

            <div className="flex flex-col min-w-0 flex-1 leading-[1.5]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[14.5px] font-semibold text-slate-100 truncate">
                  {item.title}
                </span>
                <span
                  className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded uppercase flex-shrink-0 ml-1.5"
                  style={{
                    color: item.color || '#00f7ff',
                    background: `${item.color || '#00f7ff'}20`,
                  }}
                >
                  {item.badge || item.type || 'LIVE'}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400 mt-1 truncate">
                {item.detail}
              </span>
            </div>
          </div>
        ))}

        {/* Task Overdue Notice Pill */}
        <div
          className="p-3 rounded-xl flex items-center justify-between mt-auto"
          style={{
            background: 'rgba(255, 51, 85, 0.12)',
            border: '1px solid rgba(255, 51, 85, 0.35)',
          }}
        >
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-xs font-bold text-rose-400">
              2 tasks overdue
            </span>
            <span className="font-mono text-[11px] text-slate-400 truncate mt-0.5">
              Review the board and reschedule...
            </span>
          </div>
          <button className="px-3 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono text-[11px] font-bold hover:bg-rose-900 transition-colors flex-shrink-0 ml-2 cursor-pointer">
            View Tasks
          </button>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-2.5 border-t border-cyan-500/15 text-center mt-2">
        <button className="text-xs font-mono text-cyan-400 hover:underline font-medium">
          View All Intelligence ›
        </button>
      </div>
    </div>
  );
}
