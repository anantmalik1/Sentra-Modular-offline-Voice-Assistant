'use client';

import React, { useState } from 'react';
import { X, Server, Key } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface ProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProvidersModal({ isOpen, onClose }: ProvidersModalProps) {
  const { providers, toggleProvider } = useDashboard();
  const [activeKeyProvider, setActiveKeyProvider] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  if (!isOpen) return null;

  const handleSaveKey = (providerId: string) => {
    toggleProvider(providerId, apiKeyInput);
    setActiveKeyProvider(null);
    setApiKeyInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="hud-panel p-6 w-full max-w-lg border-cyan-400/50 shadow-[0_0_30px_rgba(0,217,255,0.3)] bg-[#071124]/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
          <div className="flex items-center space-x-2.5">
            <Server className="text-cyan-400" size={20} />
            <span className="font-mono text-sm font-bold text-cyan-300 uppercase tracking-wider">
              MANAGE LLM INTELLIGENCE PROVIDERS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Provider List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {providers.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-xl bg-[#0a1834] border border-cyan-400/15 hover:border-cyan-400/35 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: p.connected ? '#22c55e' : '#64748b',
                      boxShadow: p.connected ? '0 0 6px #22c55e' : 'none',
                    }}
                  />
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-100">
                      {p.name}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      Status: <span style={{ color: p.connected ? '#22c55e' : '#94a3b8' }}>{p.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setActiveKeyProvider(activeKeyProvider === p.id ? null : p.id);
                      setApiKeyInput('');
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                    title="Configure Provider API Key"
                  >
                    <Key size={13} />
                  </button>
                  <button
                    onClick={() => toggleProvider(p.id)}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                      p.connected
                        ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80'
                        : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
                    }`}
                  >
                    {p.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>

              {/* Key Config input */}
              {activeKeyProvider === p.id && (
                <div className="flex items-center space-x-2 pt-2 border-t border-cyan-500/15">
                  <input
                    type="password"
                    placeholder={`Enter ${p.name} API Key...`}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded bg-[#071124] border border-cyan-400/30 text-xs font-mono text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSaveKey(p.id)}
                    className="px-3 py-1 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-cyan-500/20 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
