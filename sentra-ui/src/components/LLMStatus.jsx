import React from 'react';

export default function LLMStatus({ providers = [], onOpenManage }) {
  const connectedCount = providers.filter((p) => p.connected).length;

  return (
    <div className="hud-panel p-5 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <span className="hud-panel-title text-sm">LLM STATUS</span>
        <span className="text-xs font-mono text-cyan-400 font-bold">{connectedCount} Connected</span>
      </div>

      {/* 3x3 Grid of Providers */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2 flex-1 min-h-0">
        {providers.map((p, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg transition-all"
            style={{
              background: p.connected
                ? 'rgba(0, 217, 255, 0.12)'
                : 'rgba(6, 14, 32, 0.75)',
              border: p.connected
                ? '1px solid rgba(0, 247, 255, 0.35)'
                : '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: p.connected ? '#00ff88' : '#64748b',
                boxShadow: p.connected ? '0 0 6px #00ff88' : 'none',
              }}
            />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-mono text-[14px] font-bold text-slate-200 truncate">
                {p.name}
              </span>
              <span
                className="font-mono text-[11px] font-medium truncate mt-0.5"
                style={{ color: p.connected ? '#00ff88' : '#94a3b8' }}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Working Manage Providers Link */}
      <div className="pt-2 border-t border-cyan-500/15 text-center mt-1">
        <button
          onClick={onOpenManage}
          className="text-xs font-mono text-cyan-400 hover:underline font-medium cursor-pointer"
        >
          Manage Providers ›
        </button>
      </div>
    </div>
  );
}
