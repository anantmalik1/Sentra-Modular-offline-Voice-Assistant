import React from 'react';
import {
  Code2,
  Search,
  Database,
  Globe,
  CheckSquare,
  Terminal,
} from 'lucide-react';

const AGENTS = [
  {
    id: 'code',
    name: 'Coding Agent',
    icon: Code2,
    intents: ['write_code'],
    status: 'Active',
    color: '#00ff88',
  },
  {
    id: 'research',
    name: 'Research Agent',
    icon: Search,
    intents: ['search', 'chat'],
    status: 'Active',
    color: '#00f7ff',
  },
  {
    id: 'memory',
    name: 'Memory Agent',
    icon: Database,
    intents: ['remember', 'recall'],
    status: 'Standby',
    color: '#9d4edd',
  },
  {
    id: 'browser',
    name: 'Browser Agent',
    icon: Globe,
    intents: ['open_app', 'play_youtube'],
    status: 'Standby',
    color: '#ffaa00',
  },
  {
    id: 'task',
    name: 'Task Agent',
    icon: CheckSquare,
    intents: ['schedule', 'send_email'],
    status: 'Standby',
    color: '#0088ff',
  },
  {
    id: 'system',
    name: 'System Agent',
    icon: Terminal,
    intents: ['system_action', 'tell_time'],
    status: 'Standby',
    color: '#00ff88',
  },
];

export default function AgentPanel({ currentIntent, state = 'IDLE' }) {
  return (
    <div className="hud-panel p-5 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
        <span className="hud-panel-title text-sm">ACTIVE AGENTS</span>
        <button className="text-xs font-mono text-cyan-400 hover:underline">
          View All ›
        </button>
      </div>

      {/* 2x3 Grid of Agent Cards with larger labels */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3 flex-1 min-h-0">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isTriggered =
            (state === 'PROCESSING' || state === 'EXECUTING' || state === 'THINKING') &&
            agent.intents.includes(currentIntent);

          const isActive = isTriggered || agent.status === 'Active';

          return (
            <div
              key={agent.id}
              className="p-3 rounded-xl flex flex-col justify-between transition-all"
              style={{
                background: isTriggered
                  ? 'rgba(0, 247, 255, 0.15)'
                  : 'rgba(6, 14, 32, 0.85)',
                border: isTriggered
                  ? '1.5px solid #00f7ff'
                  : '1px solid rgba(0, 247, 255, 0.15)',
              }}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(0, 247, 255, 0.15)',
                    color: agent.color,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[15px] font-bold text-slate-100 truncate leading-snug">
                    {agent.name}
                  </span>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isActive ? '#00ff88' : '#64748b',
                        boxShadow: isActive ? '0 0 6px #00ff88' : 'none',
                      }}
                    />
                    <span
                      className="font-mono text-xs font-medium"
                      style={{ color: isActive ? '#00ff88' : '#64748b' }}
                    >
                      {isActive ? 'Active' : 'Standby'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Soundwave activity bar */}
              <div className="flex items-center space-x-1 mt-2.5 h-3 px-1">
                {[4, 8, 3, 6, 10, 4, 7, 5, 9, 3].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full transition-all"
                    style={{
                      height: isActive ? `${h * 1.2}px` : '3px',
                      backgroundColor: isActive ? agent.color : '#334155',
                      opacity: isActive ? 0.85 : 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
