'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Mic, Play, Loader2 } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface QuickCommandsProps {
  onRunCommand?: (cmd: string) => void;
  onOpenNewTask?: () => void;
  onOpenCalendar?: () => void;
  onStartVoice?: () => void;
}

export default function QuickCommands({
  onRunCommand,
  onOpenNewTask,
  onOpenCalendar,
  onStartVoice,
}: QuickCommandsProps) {
  const { pushActivity } = useDashboard();
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);

  const handleRunWorkflow = async () => {
    setIsRunningWorkflow(true);
    await pushActivity(
      'Automated Neural Audit Started',
      'Scanning sub-agents, host memory integrity, and network gateways...',
      'LIVE'
    );

    setTimeout(async () => {
      setIsRunningWorkflow(false);
      await pushActivity(
        'Neural Audit Completed',
        'All 6 sub-agents verified, host security nominal',
        'LIVE'
      );
    }, 2200);
  };

  const commands = [
    {
      label: 'Start New Task',
      icon: Plus,
      action: () => {
        if (onOpenNewTask) onOpenNewTask();
        else onRunCommand?.('create task');
      },
    },
    {
      label: 'Open Calendar',
      icon: Calendar,
      action: () => {
        if (onOpenCalendar) onOpenCalendar();
        else onRunCommand?.('open calendar');
      },
    },
    {
      label: 'Start Voice Chat',
      icon: Mic,
      action: () => {
        if (onStartVoice) onStartVoice();
        else onRunCommand?.('start voice chat');
      },
    },
    {
      label: isRunningWorkflow ? 'Running...' : 'Run Workflow',
      icon: isRunningWorkflow ? Loader2 : Play,
      action: handleRunWorkflow,
    },
  ];

  return (
    <div className="hud-panel p-2 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-cyan-400/15">
        <span className="hud-title text-[9.5px]">QUICK COMMANDS</span>
      </div>

      {/* Grid / Stack of Button Chips */}
      <div className="flex flex-col justify-between flex-1 gap-1 min-h-0">
        {commands.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.action}
              className="flex items-center space-x-2 px-2 py-1 rounded-md text-[8.5px] font-mono text-slate-300 hover:text-cyan-200 bg-[#071124]/80 border border-cyan-400/15 hover:border-cyan-400/40 hover:shadow-[0_0_8px_rgba(0,217,255,0.2)] transition-all cursor-pointer text-left"
            >
              <div className="w-4 h-4 rounded flex items-center justify-center bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                <Icon size={10} className={isRunningWorkflow && item.label.includes('Running') ? 'animate-spin' : ''} />
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
