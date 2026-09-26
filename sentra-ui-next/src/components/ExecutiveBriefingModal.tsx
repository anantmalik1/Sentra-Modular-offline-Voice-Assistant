'use client';

import React from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Bot,
  Activity,
  HardDrive,
} from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExecutiveBriefingModal({ isOpen, onClose }: ExecutiveBriefingModalProps) {
  const { user, tasks, agents, metrics, memoryStats, providers } = useDashboard();

  if (!isOpen) return null;

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const activeAgents = agents.filter((a) => a.status === 'Active');
  const connectedProviders = providers.filter((p) => p.connected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-6">
      <div className="hud-panel p-6 w-full max-w-2xl border-cyan-400/50 shadow-[0_0_35px_rgba(0,217,255,0.35)] bg-[#071124]/95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(0,217,255,0.4)]">
              <FileText size={22} />
            </div>
            <div>
              <span className="font-mono text-[16px] font-bold text-cyan-300 uppercase tracking-wider block">
                SENTRA EXECUTIVE INTELLIGENCE BRIEFING
              </span>
              <span className="font-mono text-[13px] text-slate-400">
                Commander: {user?.name || 'Anant Malik'} // Role: {user?.role || 'Commander'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* 1. High-Level Metrics Summary */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#0a1834] border border-cyan-400/20 text-center">
              <span className="font-mono text-[12px] text-slate-400 uppercase block">Done Tasks</span>
              <span className="font-mono text-[22px] font-bold text-emerald-400 mt-1 block">
                {completedTasks.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0a1834] border border-cyan-400/20 text-center">
              <span className="font-mono text-[12px] text-slate-400 uppercase block">Pending Items</span>
              <span className="font-mono text-[22px] font-bold text-amber-400 mt-1 block">
                {pendingTasks.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0a1834] border border-cyan-400/20 text-center">
              <span className="font-mono text-[12px] text-slate-400 uppercase block">Active Agents</span>
              <span className="font-mono text-[22px] font-bold text-cyan-400 mt-1 block">
                {activeAgents.length}/{agents.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0a1834] border border-cyan-400/20 text-center">
              <span className="font-mono text-[12px] text-slate-400 uppercase block">LLM Engines</span>
              <span className="font-mono text-[22px] font-bold text-purple-400 mt-1 block">
                {connectedProviders.length}
              </span>
            </div>
          </div>

          {/* 2. Tasks Status Breakdown */}
          <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-cyan-400/10">
              <span className="font-mono text-[14px] font-bold text-slate-200 uppercase flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Mission Task Directives</span>
              </span>
              <span className="font-mono text-[12px] text-slate-400">
                {tasks.length} Total Registered
              </span>
            </div>

            {tasks.length === 0 ? (
              <p className="font-mono text-[13px] text-slate-500 py-1">
                No active or historical tasks on record for this cycle.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#071124] border border-cyan-400/10 font-mono text-[13px]"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={t.completed ? 'text-emerald-400' : 'text-amber-400'}>
                        {t.completed ? '✓' : '●'}
                      </span>
                      <span className={t.completed ? 'line-through text-slate-500 truncate' : 'text-slate-200 truncate'}>
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[12px] text-slate-400 ml-2 flex-shrink-0">
                      {t.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Sub-Agent Grid Overview */}
          <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-cyan-400/10">
              <span className="font-mono text-[14px] font-bold text-slate-200 uppercase flex items-center gap-2">
                <Bot size={16} className="text-cyan-400" />
                <span>Autonomous Sub-Agent Matrix</span>
              </span>
              <span className="font-mono text-[12px] text-emerald-400">
                {activeAgents.length} Online
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-2 rounded-lg bg-[#071124] border border-cyan-400/10 font-mono flex items-center justify-between"
                >
                  <span className="text-[13px] text-slate-200 font-semibold truncate">
                    {agent.name}
                  </span>
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded font-bold"
                    style={{
                      color: agent.status === 'Active' ? '#22c55e' : '#94a3b8',
                      background: agent.status === 'Active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    }}
                  >
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Telemetry & Hardware Diagnostics */}
          <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-cyan-400/10">
              <span className="font-mono text-[14px] font-bold text-slate-200 uppercase flex items-center gap-2">
                <Activity size={16} className="text-purple-400" />
                <span>Host Telemetry & Vector Store</span>
              </span>
              <span className="font-mono text-[12px] text-cyan-400 font-semibold">
                Status: Nominal
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[13px]">
              <div className="p-2 rounded-lg bg-[#071124] border border-cyan-400/10 flex justify-between">
                <span className="text-slate-400">CPU Load:</span>
                <span className="text-cyan-300 font-bold">{metrics.cpu}%</span>
              </div>
              <div className="p-2 rounded-lg bg-[#071124] border border-cyan-400/10 flex justify-between">
                <span className="text-slate-400">RAM Allocated:</span>
                <span className="text-cyan-300 font-bold">{metrics.ram}%</span>
              </div>
              <div className="p-2 rounded-lg bg-[#071124] border border-cyan-400/10 flex justify-between">
                <span className="text-slate-400">Memories Stored:</span>
                <span className="text-emerald-300 font-bold">{memoryStats.memories}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-end mt-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-[14px] font-mono font-bold bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
          >
            DISMISS BRIEFING
          </button>
        </div>
      </div>
    </div>
  );
}
