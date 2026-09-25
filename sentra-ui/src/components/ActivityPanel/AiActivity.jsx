import React from 'react';
import { Activity, CheckCircle2, AlertCircle, Clock, Terminal, ChevronRight } from 'lucide-react';

export default function AiActivity({ state, currentTask, activities = [] }) {
  return (
    <div className="flex flex-col h-full glass-panel p-4 overflow-hidden border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/15">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="hud-label text-slate-200">AI Activity Stream</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
          {state}
        </span>
      </div>

      {/* Real-time Status Banner */}
      {currentTask && (
        <div className="mb-3 p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/30">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold">CURRENT DIRECTIVE</span>
          </div>
          <p className="text-xs text-slate-200 truncate">"{currentTask}"</p>
        </div>
      )}

      {/* Activity Timeline List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-center text-slate-500">
            <Terminal className="w-8 h-8 mb-2 opacity-40 text-cyan-400" />
            <p className="text-xs font-mono">STANDBY MODE</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Awaiting user voice transmission</p>
          </div>
        ) : (
          activities.map((act, index) => (
            <div
              key={index}
              className="flex items-start space-x-2.5 text-xs font-mono p-2 rounded-md bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition-colors"
            >
              <span className="mt-0.5 text-cyan-400 flex-shrink-0">
                {act.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : act.type === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="uppercase text-cyan-400/80">{act.step}</span>
                  <span>{act.time}</span>
                </div>
                <p className="text-slate-300 text-[11px] mt-0.5 break-words">
                  {act.detail}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
