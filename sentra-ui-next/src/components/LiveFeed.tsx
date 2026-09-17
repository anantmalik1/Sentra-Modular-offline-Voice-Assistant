'use client';

import React from 'react';
import { AlertTriangle, Info, Bell, CheckCircle } from 'lucide-react';
import { MOCK_INTELLIGENCE } from '../data/mockData';

const TAG_STYLES = {
  INFO: { color: '#00d9ff', bg: 'rgba(0, 217, 255, 0.12)', border: 'rgba(0, 217, 255, 0.3)' },
  WARN: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' },
  TIP: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)' },
  LIVE: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)' },
};

export default function LiveFeed() {
  return (
    <div className="hud-panel p-2.5 flex flex-col justify-between h-full w-[255px] flex-shrink-0">
      {/* Header with ● LIVE badge */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-400/15">
        <span className="hud-title text-[9.5px]">LIVE INTELLIGENCE FEED</span>
        <div className="flex items-center space-x-1 px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[7.5px] text-emerald-300 font-bold">LIVE</span>
        </div>
      </div>

      {/* Feed Cards Stack */}
      <div className="flex flex-col justify-between flex-1 gap-1.5 min-h-0 overflow-y-auto pr-0.5">
        {MOCK_INTELLIGENCE.map((item) => {
          const style = TAG_STYLES[item.tag] || TAG_STYLES.INFO;
          return (
            <div
              key={item.id}
              className="p-1.5 rounded-md bg-[#071124]/75 border border-cyan-400/10 hover:border-cyan-400/30 flex items-start space-x-2 transition-all"
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: style.bg,
                  color: style.color,
                  border: `1px solid ${style.border}`,
                }}
              >
                {item.tag === 'WARN' ? (
                  <AlertTriangle size={11} />
                ) : (
                  <Info size={11} />
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1 leading-tight">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8.5px] font-semibold text-slate-200 truncate">
                    {item.title}
                  </span>
                  <span
                    className="font-mono text-[7px] font-bold px-1 rounded uppercase flex-shrink-0 ml-1"
                    style={{
                      color: style.color,
                      background: style.bg,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <span className="font-mono text-[8px] text-slate-400 mt-0.5 truncate">
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}

        {/* 2 tasks overdue alert banner */}
        <div className="p-1.5 rounded-md bg-rose-950/30 border border-rose-500/30 flex items-center justify-between mt-auto">
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[8px] font-bold text-rose-400">
              2 tasks overdue
            </span>
            <span className="font-mono text-[7px] text-slate-400 truncate">
              Review board and reschedule...
            </span>
          </div>
          <button className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono text-[7.5px] font-bold hover:bg-rose-900 transition-colors flex-shrink-0 ml-1">
            View Tasks
          </button>
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-1 border-t border-cyan-400/10 text-center mt-1">
        <button className="text-[8px] font-mono text-cyan-400 hover:underline">
          View All Intelligence ›
        </button>
      </div>
    </div>
  );
}
