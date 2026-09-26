'use client';

import React, { useState } from 'react';
import { X, Sliders, Server, User, Moon, LogOut, Check } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import ProvidersModal from './ProvidersModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, logout } = useDashboard();
  const [isProvidersOpen, setIsProvidersOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('Cyber Dark (Default)');

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-6">
        <div className="hud-panel p-6 w-full max-w-lg border-cyan-400/50 shadow-[0_0_30px_rgba(0,217,255,0.3)] bg-[#071124]/95 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2.5">
              <Sliders className="text-cyan-400" size={24} />
              <span className="font-mono text-[16px] font-bold text-cyan-300 uppercase tracking-wider">
                SENTRA SYSTEM & OPERATOR SETTINGS
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Profile Information */}
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20">
              <div className="flex items-center space-x-3 mb-2">
                <User size={18} className="text-cyan-400" />
                <span className="font-mono text-[15px] font-bold text-slate-200">
                  COMMANDER PROFILE
                </span>
              </div>
              <div className="space-y-1 font-mono text-[14px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-slate-100 font-semibold">{user?.name || 'Anant Malik'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-100">{user?.email || 'commander@sentra.ai'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authorization:</span>
                  <span className="text-cyan-400 font-bold">{user?.role || 'Commander'} (Tier 1)</span>
                </div>
              </div>
            </div>

            {/* 2. LLM Provider Keys */}
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Server size={18} className="text-cyan-400" />
                <div>
                  <div className="font-mono text-[15px] font-bold text-slate-200">
                    LLM PROVIDER KEYS & MODELS
                  </div>
                  <div className="font-mono text-[13px] text-slate-400">
                    Configure Groq, OpenAI, Claude, Ollama credentials
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsProvidersOpen(true)}
                className="px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[14px] font-bold hover:bg-cyan-900 transition-colors cursor-pointer"
              >
                MANAGE KEYS
              </button>
            </div>

            {/* 3. Theme & Aesthetics */}
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20">
              <div className="flex items-center space-x-3 mb-2">
                <Moon size={18} className="text-cyan-400" />
                <span className="font-mono text-[15px] font-bold text-slate-200">
                  HUD THEME PRESET
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Cyber Dark (Default)', 'Deep Matrix Blue'].map((thm) => (
                  <button
                    key={thm}
                    onClick={() => setActiveTheme(thm)}
                    className={`p-2 rounded-lg border text-left font-mono text-[13px] flex items-center justify-between cursor-pointer transition-all ${
                      activeTheme === thm
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300'
                        : 'bg-[#071124] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{thm}</span>
                    {activeTheme === thm && <Check size={14} className="text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Session & Logout */}
            <div className="pt-2 flex items-center justify-between border-t border-cyan-500/20">
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-rose-300 hover:bg-rose-950/60 border border-rose-500/30 font-mono text-[14px] font-bold cursor-pointer transition-colors"
              >
                <LogOut size={16} />
                <span>TERMINATE SESSION</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg text-[14px] font-mono font-bold bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProvidersModal
        isOpen={isProvidersOpen}
        onClose={() => setIsProvidersOpen(false)}
      />
    </>
  );
}
