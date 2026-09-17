import React, { useState } from 'react';
import { X, Server, CheckCircle2, ShieldCheck, RefreshCw, Key } from 'lucide-react';

export default function ProvidersModal({ isOpen, onClose, providers, onToggleProvider }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="hud-panel p-6 w-full max-w-lg border-cyan-400/50 shadow-[0_0_30px_rgba(0,217,255,0.3)] bg-[#071124]/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
          <div className="flex items-center space-x-2.5">
            <Server className="text-cyan-400" size={20} />
            <span className="hud-panel-title text-base font-bold text-cyan-300">
              MANAGE LLM INTELLIGENCE PROVIDERS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Provider List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {providers.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0a1834] border border-cyan-400/15 hover:border-cyan-400/35 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: p.connected ? '#00ff88' : '#64748b',
                    boxShadow: p.connected ? '0 0 8px #00ff88' : 'none',
                  }}
                />
                <div>
                  <div className="font-mono text-sm font-bold text-slate-100">
                    {p.name}
                  </div>
                  <div className="font-mono text-xs text-slate-400">
                    Status: <span style={{ color: p.connected ? '#00ff88' : '#94a3b8' }}>{p.status}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onToggleProvider(p.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  p.connected
                    ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80'
                    : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
                }`}
              >
                {p.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-cyan-500/20 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
