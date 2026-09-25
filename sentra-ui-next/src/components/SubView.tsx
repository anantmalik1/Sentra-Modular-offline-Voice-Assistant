'use client';

import React from 'react';
import {
  Calendar as CalendarIcon,
  Bot,
  CheckSquare,
  Database,
  MessageSquare,
  BookOpen,
  Wrench,
  GitMerge,
  Cpu,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface SubViewProps {
  viewId: string;
  onBack: () => void;
  onOpenNewTask?: () => void;
}

export default function SubView({ viewId, onBack, onOpenNewTask }: SubViewProps) {
  const { tasks, toggleTask, pushActivity, memoryStats, agents } = useDashboard();

  const titles: Record<string, { title: string; icon: React.ElementType; desc: string }> = {
    ai_core: { title: 'SENTRA AI CORE ARCHITECTURE', icon: Cpu, desc: 'Direct neural interface and core reasoning pipelines.' },
    agents: { title: 'AUTONOMOUS SUB-AGENTS MATRIX', icon: Bot, desc: 'Multi-agent orchestration, intent routers, and execution workers.' },
    tasks: { title: 'MISSION TASKS & DISPATCH QUEUE', icon: CheckSquare, desc: 'Scheduled cron tasks, automation jobs, and background workers.' },
    calendar: { title: 'SENTRA STRATEGIC CALENDAR', icon: CalendarIcon, desc: 'Timeline planning, deep-work synchronization, and meetings.' },
    memory: { title: 'COGNITIVE VECTOR MEMORY', icon: Database, desc: 'Long-term associative storage, user preferences, and neural weights.' },
    conversations: { title: 'SECURE CONVERSATION ARCHIVE', icon: MessageSquare, desc: 'Full transcript history, sentiment telemetry, and audio logs.' },
    knowledge: { title: 'NEURAL KNOWLEDGE BASE', icon: BookOpen, desc: 'Indexed documents, code repositories, and specialized domain skills.' },
    tools: { title: 'HARDWARE & WORKSTATION TOOLS', icon: Wrench, desc: 'System controllers, audio engines, and browser driver protocols.' },
    workflows: { title: 'AUTONOMOUS PIPELINE WORKFLOWS', icon: GitMerge, desc: 'Chain-of-thought DAG graphs and multi-step dispatch pipelines.' },
  };

  const current = titles[viewId] || { title: 'COMMAND CENTER SUB-MODULE', icon: Sparkles, desc: 'Module active and synchronized.' };
  const Icon = current.icon;

  return (
    <div className="hud-panel p-6 flex flex-col flex-1 h-full min-h-[500px] w-full z-10">
      {/* View Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/25">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.3)]">
            <Icon size={22} />
          </div>
          <div>
            <h2 className="font-mono text-base font-bold text-cyan-300 tracking-wider uppercase">
              {current.title}
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-0.5">
              {current.desc}
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0a1834] border border-cyan-400/30 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(0,217,255,0.15)]"
        >
          <ArrowLeft size={14} />
          <span>RETURN TO DASHBOARD</span>
        </button>
      </div>

      {/* Calendar View */}
      {viewId === 'calendar' && (
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs text-cyan-400 pb-2 border-b border-cyan-500/15">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
              <div key={d} className="font-bold">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 flex-1">
            {[15, 16, 17, 18, 19, 20, 21].map((day, idx) => (
              <div
                key={day}
                className={`p-3 rounded-xl border flex flex-col justify-between min-h-[90px] ${
                  idx === 0
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
                    : 'bg-[#071124]/80 border-cyan-400/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-slate-100">{day}</span>
                  {idx === 0 && <span className="text-[10px] font-mono font-bold text-emerald-400">TODAY</span>}
                </div>
                {idx === 0 && (
                  <div className="mt-2 text-[11px] font-mono text-cyan-300 p-1.5 rounded bg-cyan-900/40 border border-cyan-500/30">
                    {tasks.length} Tasks Scheduled
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks View */}
      {viewId === 'tasks' && (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>ACTIVE REGISTERED TASKS // {tasks.length} IN QUEUE</span>
            {onOpenNewTask && (
              <button
                onClick={onOpenNewTask}
                className="px-3 py-1 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[11px] font-bold hover:bg-cyan-900 cursor-pointer"
              >
                + ADD MISSION TASK
              </button>
            )}
          </div>
          {tasks.length === 0 ? (
            <div className="text-center py-10 font-mono text-xs text-slate-500">
              No tasks currently registered for this Operator account.
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a1834] border border-cyan-400/20 hover:border-cyan-400/40 cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3">
                  <CheckSquare size={16} className={t.completed ? 'text-emerald-400' : 'text-cyan-400'} />
                  <div>
                    <div className={`font-mono text-sm font-bold ${t.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {t.title}
                    </div>
                    <div className="font-mono text-xs text-slate-400 mt-0.5">Scheduled: {t.time}</div>
                  </div>
                </div>
                <span
                  className="font-mono text-xs px-2.5 py-1 rounded-full font-bold"
                  style={{
                    color: t.completed ? '#22c55e' : '#00d9ff',
                    background: t.completed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(0, 217, 255, 0.15)',
                    border: `1px solid ${t.completed ? '#22c55e40' : '#00d9ff40'}`,
                  }}
                >
                  {t.completed ? 'Done' : 'Active'}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Generic Sub-Modules */}
      {viewId !== 'calendar' && viewId !== 'tasks' && (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(0,217,255,0.25)]">
            <Icon size={32} />
          </div>
          <h3 className="font-mono text-base font-bold text-slate-100 uppercase tracking-widest">
            {current.title} ONLINE
          </h3>
          <p className="font-mono text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
            Neural telemetry, real-time parameters, and state controllers for this module are active and linked to the SENTRA Core Dispatch Engine.
          </p>
          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={() => pushActivity(`Diagnostics on ${viewId}`, 'Module health checked and verified nominal', 'LIVE')}
              className="px-5 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,217,255,0.2)] cursor-pointer"
            >
              RUN SUBMODULE DIAGNOSTICS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
