'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function MissionTimeline() {
  const { tasks, toggleTask } = useDashboard();

  return (
    <div className="hud-panel p-6 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-400/15">
        <span className="hud-title">MISSION TIMELINE</span>
        <span className="text-[18px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/25">
          {tasks.length} Scheduled
        </span>
      </div>

      {/* Timeline Task List */}
      <div className="flex flex-col justify-start flex-1 gap-2 min-h-0 overflow-y-auto pr-0.5">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-3">
            <span className="font-mono text-[15px] text-slate-400">No mission tasks scheduled</span>
            <span className="font-mono text-[14px] text-cyan-400/70 mt-1">Use Quick Commands to add one</span>
          </div>
        ) : (
          tasks.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => toggleTask(item.id)}
              className="flex items-center justify-between text-[15px] font-mono p-2 rounded-lg hover:bg-slate-900/50 transition-colors cursor-pointer leading-[1.5]"
              title="Click to toggle Done / Active"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="text-slate-400 w-16 flex-shrink-0 text-[14px]">
                  {item.time}
                </span>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: item.completed ? '#22c55e' : '#00d9ff',
                    boxShadow: item.completed ? '0 0 4px #22c55e' : '0 0 4px #00d9ff',
                  }}
                />
                <span className={`truncate font-medium ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {item.title}
                </span>
              </div>
              <span
                className="text-[14px] px-2 py-0.5 rounded flex-shrink-0 ml-1 font-bold"
                style={{
                  color: item.completed ? '#22c55e' : '#00d9ff',
                  background: item.completed ? 'rgba(34, 197, 94, 0.12)' : 'rgba(0, 217, 255, 0.12)',
                }}
              >
                {item.completed ? 'Done' : item.status || 'Active'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer link */}
      <div className="pt-1.5 border-t border-cyan-400/10 text-center mt-1">
        <button className="text-[14px] font-mono text-cyan-400 hover:underline cursor-pointer">
          View Full Schedule ›
        </button>
      </div>
    </div>
  );
}
