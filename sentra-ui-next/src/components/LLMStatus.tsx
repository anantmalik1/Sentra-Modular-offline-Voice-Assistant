'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';

interface LLMStatusProps {
  onOpenManage?: () => void;
}

export default function LLMStatus({ onOpenManage }: LLMStatusProps) {
  const { providers, toggleProvider } = useDashboard();
  const connectedCount = providers.filter((p) => p.connected).length;

  return (
    <div className="hud-panel p-6 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-400/15">
        <span className="hud-title">LLM STATUS</span>
        <span className="text-[18px] font-mono text-cyan-400 font-bold">
          {connectedCount} Connected
        </span>
      </div>

      {/* 3x3 Grid of Providers */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2.5 flex-1 min-h-0">
        {providers.map((p) => (
          <div
            key={p.id}
            onClick={() => toggleProvider(p.id)}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer hover:border-cyan-400/50"
            title="Click to toggle connection"
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
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: p.connected ? '#22c55e' : '#475569',
                boxShadow: p.connected ? '0 0 4px #22c55e' : 'none',
              }}
            />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-mono text-[15px] font-bold text-slate-200 truncate">
                {p.name}
              </span>
              <span
                className="font-mono text-[13px] truncate mt-0.5"
                style={{ color: p.connected ? '#22c55e' : '#94a3b8' }}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-1.5 border-t border-cyan-400/10 text-center mt-1">
        <button
          onClick={onOpenManage}
          className="text-[14px] font-mono text-cyan-400 hover:underline cursor-pointer"
        >
          Manage Providers ›
        </button>
      </div>
    </div>
  );
}
