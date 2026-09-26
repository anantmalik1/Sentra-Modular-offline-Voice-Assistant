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
  Zap,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface SubViewProps {
  viewId: string;
  onBack: () => void;
  onOpenNewTask?: () => void;
}

export default function SubView({ viewId, onBack, onOpenNewTask }: SubViewProps) {
  const {
    tasks,
    toggleTask,
    pushActivity,
    memoryStats,
    agents,
    toggleAgent,
    providers,
    memories,
    conversations,
  } = useDashboard();

  const [selectedDayIdx, setSelectedDayIdx] = React.useState(0);
  const [dayTasksModalOpen, setDayTasksModalOpen] = React.useState(false);

  const calendarDays = [
    { day: 15, name: 'Monday', label: 'MON' },
    { day: 16, name: 'Tuesday', label: 'TUE' },
    { day: 17, name: 'Wednesday', label: 'WED' },
    { day: 18, name: 'Thursday', label: 'THU' },
    { day: 19, name: 'Friday', label: 'FRI' },
    { day: 20, name: 'Saturday', label: 'SAT' },
    { day: 21, name: 'Sunday', label: 'SUN' },
  ];

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
    <div className="hud-panel p-6 flex flex-col flex-1 h-full min-h-[550px] w-full z-10">
      {/* View Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/25 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.3)]">
            <Icon size={22} />
          </div>
          <div>
            <h2 className="font-mono text-base font-bold text-cyan-300 tracking-wider uppercase">
              {current.title}
            </h2>
            <p className="font-mono text-base text-slate-400 mt-0.5">
              {current.desc}
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0a1834] border border-cyan-400/30 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 text-base font-mono font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(0,217,255,0.15)]"
        >
          <ArrowLeft size={18} />
          <span>RETURN TO DASHBOARD</span>
        </button>
      </div>

      {/* CALENDAR VIEW */}
      {viewId === 'calendar' && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-base font-mono text-slate-400">
            <span>TACTICAL CALENDAR TIMELINE // MARCH 2026</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                Active Selection: {calendarDays[selectedDayIdx].name} (Day {calendarDays[selectedDayIdx].day})
              </span>
              {onOpenNewTask && (
                <button
                  onClick={onOpenNewTask}
                  className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-sm font-mono font-bold hover:bg-cyan-900 cursor-pointer"
                >
                  + ADD TASK FOR THIS DAY
                </button>
              )}
            </div>
          </div>

          {/* Day Selector Tiles (Mon - Sun) */}
          <div className="grid grid-cols-7 gap-2.5">
            {calendarDays.map((d, idx) => {
              const isSelected = selectedDayIdx === idx;
              // Filter tasks mock for this day
              const dayTasks = tasks.filter((_, tIdx) => (tIdx % 7) === idx);
              return (
                <button
                  key={d.label}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[110px] ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.3)] ring-1 ring-cyan-400'
                      : 'bg-[#0a1834] border-cyan-400/20 hover:border-cyan-400/50 hover:bg-[#0c1e40]'
                  }`}
                >
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-400">{d.label}</span>
                  <span className={`text-2xl font-mono font-bold my-1 ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                    {d.day}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                      dayTasks.length > 0
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-700/30'
                    }`}
                  >
                    {dayTasks.length} {dayTasks.length === 1 ? 'Task' : 'Tasks'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Agenda & Task Details */}
          <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-400/10">
              <div className="flex items-center space-x-2">
                <CalendarIcon size={18} className="text-cyan-400" />
                <h3 className="font-mono text-base font-bold text-slate-100 uppercase">
                  Agenda for {calendarDays[selectedDayIdx].name} (March {calendarDays[selectedDayIdx].day}, 2026)
                </h3>
              </div>
              <button
                onClick={() => setDayTasksModalOpen(true)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Inspect Full Timeline & Operations
              </button>
            </div>

            {/* Tasks scheduled for selected day */}
            <div className="space-y-2">
              {tasks.filter((_, tIdx) => (tIdx % 7) === selectedDayIdx).length === 0 ? (
                <div className="py-6 text-center font-mono text-sm text-slate-500">
                  No operations currently scheduled for {calendarDays[selectedDayIdx].name}.
                  <br />
                  Click <span className="text-cyan-400 font-bold">&quot;+ ADD TASK FOR THIS DAY&quot;</span> above to schedule a mission task.
                </div>
              ) : (
                tasks
                  .filter((_, tIdx) => (tIdx % 7) === selectedDayIdx)
                  .map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#061024] border border-cyan-400/20 hover:border-cyan-400/40 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <CheckSquare size={18} className={t.completed ? 'text-emerald-400' : 'text-cyan-400'} />
                        <div>
                          <div className={`font-mono text-base ${t.completed ? 'line-through text-slate-500' : 'text-slate-100 font-bold'}`}>
                            {t.title}
                          </div>
                          <div className="font-mono text-xs text-slate-400">Scheduled: {t.time}</div>
                        </div>
                      </div>
                      <span className={`font-mono text-xs px-2.5 py-0.5 rounded-full ${t.completed ? 'bg-emerald-950 text-emerald-400' : 'bg-cyan-950 text-cyan-300'}`}>
                        {t.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. TASKS VIEW */}
      {viewId === 'tasks' && (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-base font-mono text-slate-400 mb-2">
            <span>ACTIVE REGISTERED TASKS // {tasks.length} IN QUEUE</span>
            {onOpenNewTask && (
              <button
                onClick={onOpenNewTask}
                className="px-4 py-2 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-base font-bold hover:bg-cyan-900 cursor-pointer"
              >
                + ADD MISSION TASK
              </button>
            )}
          </div>
          {tasks.length === 0 ? (
            <div className="text-center py-10 font-mono text-base text-slate-500">
              No tasks currently registered for this Operator account. Use &quot;+ ADD MISSION TASK&quot; to create one.
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a1834] border border-cyan-400/20 hover:border-cyan-400/40 cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3">
                  <CheckSquare size={20} className={t.completed ? 'text-emerald-400' : 'text-cyan-400'} />
                  <div>
                    <div className={`font-mono text-base font-bold ${t.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {t.title}
                    </div>
                    <div className="font-mono text-base text-slate-400 mt-0.5">Scheduled: {t.time}</div>
                  </div>
                </div>
                <span
                  className="font-mono text-base px-3 py-1 rounded-full font-bold"
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

      {/* 3. AGENTS VIEW */}
      {viewId === 'agents' && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-base font-mono text-slate-400">
            <span>MULTI-AGENT MATRIX // {agents.filter((a) => a.status === 'Active').length} OF {agents.length} ACTIVE</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {agents.map((agent) => {
              const isActive = agent.status === 'Active';
              return (
                <div
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 hover:border-cyan-400/50 cursor-pointer transition-all flex flex-col justify-between gap-3"
                  title="Click to toggle Active / Standby"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-slate-100">{agent.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? '#22c55e' : '#64748b',
                        boxShadow: isActive ? '0 0 6px #22c55e' : 'none',
                      }}
                    />
                  </div>
                  <div className="font-mono text-base text-slate-400">{agent.role}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-cyan-400/10">
                    <span className="font-mono text-base text-slate-400">Status</span>
                    <span
                      className="font-mono text-base font-bold px-2 py-0.5 rounded"
                      style={{
                        color: isActive ? '#22c55e' : '#94a3b8',
                        background: isActive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                      }}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. AI CORE VIEW */}
      {viewId === 'ai_core' && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20">
              <div className="font-mono text-base text-slate-400 uppercase">Core Status</div>
              <div className="font-mono text-lg font-bold text-cyan-300 mt-1">ONLINE / DUAL-PIPELINE</div>
              <div className="font-mono text-base text-slate-400 mt-2">Next.js Edge Dispatch + Python Bridge Ready</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20">
              <div className="font-mono text-base text-slate-400 uppercase">Connected LLMs</div>
              <div className="font-mono text-lg font-bold text-amber-300 mt-1">
                {providers.filter((p) => p.connected).length} Linked
              </div>
              <div className="font-mono text-base text-slate-400 mt-2">OpenAI, Groq, Claude Code, Cursor enabled</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20">
              <div className="font-mono text-base text-slate-400 uppercase">Vector Storage</div>
              <div className="font-mono text-lg font-bold text-emerald-300 mt-1">
                {memoryStats.memories} Vectors
              </div>
              <div className="font-mono text-base text-slate-400 mt-2">WAL persistence enabled on sentra.db</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20">
            <h4 className="font-mono text-base font-bold text-slate-100 uppercase mb-2">Core Telemetry Diagnostics</h4>
            <button
              onClick={() => pushActivity('Core Diagnostics Initialized', 'Neural weights and reasoning pipelines nominal', 'LIVE')}
              className="px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-base font-bold hover:bg-cyan-900 cursor-pointer"
            >
              TRIGGER NEURAL HEALTH CHECK
            </button>
          </div>
        </div>
      )}

      {/* 5. MEMORY VIEW */}
      {viewId === 'memory' && (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-base font-mono text-slate-400">
            <span>COGNITIVE MEMORY ARCHIVE // {memories.length} ENTRIES</span>
          </div>
          {memories.length === 0 ? (
            <div className="text-center py-10 font-mono text-base text-slate-500">
              No memory vectors recorded yet. Voice directives and completed tasks will populate memories here.
            </div>
          ) : (
            memories.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl bg-[#0a1834] border border-cyan-400/20 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-cyan-300">{m.key}</span>
                  <span className="font-mono text-base px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase">
                    {m.category}
                  </span>
                </div>
                <p className="font-mono text-base text-slate-200 mt-1">{m.value}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. CONVERSATIONS VIEW */}
      {viewId === 'conversations' && (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-base font-mono text-slate-400">
            <span>TRANSCRIPT ARCHIVE // {conversations.length} RECORDED SESSIONS</span>
          </div>
          {conversations.length === 0 ? (
            <div className="text-center py-10 font-mono text-base text-slate-500">
              No conversation logs recorded yet. Speak into the microphone to log voice conversations.
            </div>
          ) : (
            conversations.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-[#0a1834] border border-cyan-400/20 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-slate-100">{c.title}</span>
                  <span className="font-mono text-base px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {c.intent || 'VOICE'}
                  </span>
                </div>
                <p className="font-mono text-base text-slate-300 mt-1">&ldquo;{c.transcript}&rdquo;</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 7. KNOWLEDGE BASE */}
      {viewId === 'knowledge' && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20">
              <h4 className="font-mono text-base font-bold text-cyan-300 uppercase">System Manual & Architecture</h4>
              <p className="font-mono text-base text-slate-400 mt-1">Modular architecture docs, SQLite schema, and auth protocol.</p>
              <div className="mt-3 font-mono text-base text-emerald-400">Indexed & Verified (v3.0.0)</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20">
              <h4 className="font-mono text-base font-bold text-cyan-300 uppercase">Workspace Intelligence</h4>
              <p className="font-mono text-base text-slate-400 mt-1">Python offline voice engine + Next.js HUD interface integration.</p>
              <div className="mt-3 font-mono text-base text-cyan-400">Linked to local repo</div>
            </div>
          </div>
          <button
            onClick={() => pushActivity('Knowledge Graph Re-indexed', 'All workspace vectors synced with memory cache', 'LIVE')}
            className="px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-base font-bold hover:bg-cyan-900 cursor-pointer"
          >
            RE-INDEX KNOWLEDGE BASE
          </button>
        </div>
      )}

      {/* 8. TOOLS & SKILLS */}
      {viewId === 'tools' && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Web Speech Audio Ingestion', desc: 'Real-time microphone input analyzer', status: 'Ready' },
              { name: 'SQLite Persistence Engine', desc: 'WAL mode local database', status: 'Ready' },
              { name: 'Browser Sub-agent Control', desc: 'Playwright & DOM interaction module', status: 'Ready' },
              { name: 'Voice Synthesis Engine', desc: 'Edge-TTS / Offline pyttsx3 fallback', status: 'Ready' },
              { name: 'Process Telemetry Monitor', desc: 'Live CPU & Memory polling', status: 'Active' },
              { name: 'Mission Scheduler Daemon', desc: 'Cron task dispatcher', status: 'Ready' },
            ].map((tool, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#0a1834] border border-cyan-400/20 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-base font-bold text-slate-100">{tool.name}</div>
                  <div className="font-mono text-base text-slate-400 mt-1">{tool.desc}</div>
                </div>
                <div className="mt-3 font-mono text-base text-emerald-400 font-bold uppercase">{tool.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. WORKFLOWS */}
      {viewId === 'workflows' && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-base font-bold text-slate-100 uppercase">Automated Neural Audit</h4>
                <p className="font-mono text-base text-slate-400 mt-1">Scans sub-agents, verifies memory integrity, checks network gateways.</p>
              </div>
              <button
                onClick={() => pushActivity('Neural Audit Pipeline Started', 'Workflow execution sequence in progress', 'LIVE')}
                className="mt-4 px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-base font-bold hover:bg-cyan-900 cursor-pointer"
              >
                EXECUTE WORKFLOW
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#0a1834] border border-cyan-400/20 flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-base font-bold text-slate-100 uppercase">Mission Schedule Dispatch</h4>
                <p className="font-mono text-base text-slate-400 mt-1">Polls active tasks in queue and broadcasts reminder notifications.</p>
              </div>
              <button
                onClick={() => pushActivity('Schedule Dispatch Triggered', 'Processed active mission queue items', 'LIVE')}
                className="mt-4 px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-base font-bold hover:bg-cyan-900 cursor-pointer"
              >
                EXECUTE WORKFLOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
