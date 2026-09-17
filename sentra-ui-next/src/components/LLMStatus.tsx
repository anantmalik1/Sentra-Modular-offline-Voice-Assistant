'use client';

import React from 'react';
import { MOCK_PROVIDERS } from '../data/mockData';

export default function LLMStatus() {
  const connectedCount = MOCK_PROVIDERS.filter((p) => p.connected).length;

  return (
    <div className="hud-panel p-2 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-cyan-400/15">
        <span className="hud-title text-[9.5px]">LLM STATUS</span>
        <span className="text-[7.5px] font-mono text-cyan-400 font-bold">
          {connectedCount} Connected
        </span>
      </div>

      {/* 3x3 Grid of Providers */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 flex-1 min-h-0">
        {MOCK_PROVIDERS.map((p) => (
          <div
            key={p.id}
            className="flex items-center space-x-1.5 px-1.5 py-0.5 rounded transition-all"
            style={{
              background: p.connected
                ? 'rgba(0, 217, 255, 0.08)'
                : 'rgba(7, 17, 36, 0.6)',
              border: p.connected
                ? '1px solid rgba(0, 217, 255, 0.25)'
                : '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: p.connected ? '#22c55e' : '#475569',
                boxShadow: p.connected ? '0 0 4px #22c55e' : 'none',
              }}
            />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-mono text-[8px] font-bold text-slate-200 truncate">
                {p.name}
              </span>
              <span
                className="font-mono text-[6.5px] truncate"
                style={{ color: p.connected ? '#22c55e' : '#64748b' }}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-0.5 border-t border-cyan-400/10 text-center">
        <button className="text-[8px] font-mono text-cyan-400 hover:underline">
          Manage Providers ›
        </button>
      </div>
    </div>
  );
}
