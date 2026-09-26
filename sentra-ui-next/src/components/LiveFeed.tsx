'use client';

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

const TAG_STYLES = {
  INFO: { color: '#00d9ff', bg: 'rgba(0, 217, 255, 0.12)', border: 'rgba(0, 217, 255, 0.3)' },
  WARN: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' },
  TIP: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)' },
  LIVE: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)' },
};

interface LiveFeedProps {
  onOpenTasks?: () => void;
}

export default function LiveFeed({ onOpenTasks }: LiveFeedProps) {
  const { activities, tasks } = useDashboard();
  const overdueTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="hud-panel p-6 flex flex-col justify-between h-full w-[320px] flex-shrink-0">
      {/* Header with ● LIVE badge */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-400/15">
        <span className="hud-title">LIVE INTELLIGENCE FEED</span>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[13px] text-emerald-300 font-bold">LIVE</span>
        </div>
      </div>

      {/* Feed Cards Stack */}
      <div className="flex flex-col justify-start flex-1 gap-2.5 min-h-0 overflow-y-auto pr-0.5">
        {activities.length === 0 ? (
          <div className="p-4 text-center font-mono text-[15px] text-slate-500">
            No live events logged yet. Speak or trigger a command to ingest intelligence.
          </div>
        ) : (
          activities.map((item) => {
            const style = TAG_STYLES[item.tag] || TAG_STYLES.INFO;
            return (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-[#071124]/75 border border-cyan-400/10 hover:border-cyan-400/30 flex items-start space-x-2.5 transition-all"
              >
                <div
                  className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: style.bg,
                    color: style.color,
                    border: `1px solid ${style.border}`,
                  }}
                >
                  {item.tag === 'WARN' ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <Info size={16} />
                  )}
                </div>

                <div className="flex flex-col min-w-0 flex-1 leading-normal">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[16px] font-semibold text-slate-100 truncate leading-[1.5]">
                      {item.title}
                    </span>
                    <span
                      className="font-mono text-[13px] font-bold px-1.5 py-0.2 rounded uppercase flex-shrink-0 ml-1.5"
                      style={{
                        color: style.color,
                        background: style.bg,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <span className="font-mono text-[15px] text-slate-400 mt-1 line-clamp-2 leading-[1.5]">
                    {item.description}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Dynamic tasks overdue alert banner */}
        {overdueTasksCount > 0 && (
          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-center justify-between mt-auto">
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[16px] font-bold text-rose-400">
                {overdueTasksCount} task{overdueTasksCount > 1 ? 's' : ''} in queue
              </span>
              <span className="font-mono text-[14px] text-slate-400 truncate mt-0.5">
                Review board and complete pending items...
              </span>
            </div>
            <button
              onClick={onOpenTasks}
              className="px-3 py-1 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono text-[14px] font-bold hover:bg-rose-900 transition-colors flex-shrink-0 ml-2 cursor-pointer"
            >
              View Tasks
            </button>
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-cyan-400/10 text-center mt-2">
        <button className="text-[14px] font-mono text-cyan-400 hover:underline cursor-pointer">
          View All Intelligence ›
        </button>
      </div>
    </div>
  );
}
