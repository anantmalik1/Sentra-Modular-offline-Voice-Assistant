import React, { useState } from 'react';
import { Plus, Calendar, Mic, Play, Loader2 } from 'lucide-react';

export default function QuickCommands({
  onTriggerCommand,
  onOpenNewTask,
  onOpenCalendar,
  onStartVoice,
  onRunWorkflow,
  workflowRunning = false,
}) {
  return (
    <div className="hud-panel p-5 flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <span className="hud-panel-title text-sm">QUICK COMMANDS</span>
      </div>

      {/* 2x2 Grid of Action Buttons with functional handlers */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2.5 flex-1 min-h-0">
        {/* 1. Start New Task */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[14px] font-mono text-slate-200 hover:text-cyan-200 transition-all text-left truncate cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,217,255,0.2)]"
          style={{
            background: 'rgba(6, 14, 32, 0.85)',
            border: '1px solid rgba(0, 247, 255, 0.2)',
          }}
          title="Open modal to create a task"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(0, 247, 255, 0.15)',
              color: '#00f7ff',
            }}
          >
            <Plus size={14} />
          </div>
          <span className="truncate font-medium">Start New Task</span>
        </button>

        {/* 2. Open Calendar */}
        <button
          onClick={onOpenCalendar}
          className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[14px] font-mono text-slate-200 hover:text-cyan-200 transition-all text-left truncate cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,217,255,0.2)]"
          style={{
            background: 'rgba(6, 14, 32, 0.85)',
            border: '1px solid rgba(0, 247, 255, 0.2)',
          }}
          title="Navigate to Calendar view"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(0, 247, 255, 0.15)',
              color: '#00f7ff',
            }}
          >
            <Calendar size={14} />
          </div>
          <span className="truncate font-medium">Open Calendar</span>
        </button>

        {/* 3. Start Voice Chat */}
        <button
          onClick={onStartVoice}
          className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[14px] font-mono text-slate-200 hover:text-cyan-200 transition-all text-left truncate cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,217,255,0.2)]"
          style={{
            background: 'rgba(6, 14, 32, 0.85)',
            border: '1px solid rgba(0, 247, 255, 0.2)',
          }}
          title="Start real-time voice speech recognition"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(0, 247, 255, 0.15)',
              color: '#00f7ff',
            }}
          >
            <Mic size={14} />
          </div>
          <span className="truncate font-medium">Start Voice Chat</span>
        </button>

        {/* 4. Run Workflow */}
        <button
          onClick={onRunWorkflow}
          disabled={workflowRunning}
          className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[14px] font-mono transition-all text-left truncate cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,217,255,0.2)] ${
            workflowRunning ? 'text-amber-300' : 'text-slate-200 hover:text-cyan-200'
          }`}
          style={{
            background: 'rgba(6, 14, 32, 0.85)',
            border: '1px solid rgba(0, 247, 255, 0.2)',
          }}
          title="Trigger autonomous pipeline audit workflow"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: workflowRunning ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 247, 255, 0.15)',
              color: workflowRunning ? '#f59e0b' : '#00f7ff',
            }}
          >
            {workflowRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          </div>
          <span className="truncate font-medium">
            {workflowRunning ? 'Running...' : 'Run Workflow'}
          </span>
        </button>
      </div>
    </div>
  );
}
