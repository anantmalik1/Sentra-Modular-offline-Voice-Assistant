import React from 'react';

export default function TaskTimeline({ tasks = [], onToggleTask }) {
  return (
    <div className="hud-panel p-5 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <span className="hud-panel-title text-sm">MISSION TIMELINE</span>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
          Today ▾
        </span>
      </div>

      {/* Dynamic Timeline List */}
      <div className="flex flex-col justify-between flex-1 gap-2.5 min-h-0">
        {tasks.map((it) => {
          const isDone = it.status === 'Done' || it.completed;
          return (
            <div
              key={it.id}
              onClick={() => onToggleTask?.(it.id)}
              className="flex items-center justify-between text-[14.5px] font-mono p-1.5 rounded-lg hover:bg-slate-900/50 transition-colors leading-[1.5] cursor-pointer"
              title="Click to toggle status"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <span className="text-slate-400 w-20 flex-shrink-0 text-xs">
                  {it.time}
                </span>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: isDone ? '#00ff88' : '#00f7ff',
                    boxShadow: isDone ? '0 0 6px #00ff88' : '0 0 6px #00f7ff',
                  }}
                />
                <span className={`truncate font-medium ${isDone ? 'text-slate-300 line-through' : 'text-slate-100'}`}>
                  {it.title}
                </span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded flex-shrink-0 ml-2 font-medium"
                style={{
                  color: isDone ? '#00ff88' : '#94a3b8',
                  background: isDone ? 'rgba(0, 255, 136, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                }}
              >
                {it.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-cyan-500/15 text-center mt-1">
        <button className="text-xs font-mono text-cyan-400 hover:underline">
          View Full Schedule ›
        </button>
      </div>
    </div>
  );
}
