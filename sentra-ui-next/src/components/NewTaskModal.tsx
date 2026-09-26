'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Calendar as CalendarIcon, Flag, Plus } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const { createTask } = useDashboard();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('03:30 pm');
  const [priority, setPriority] = useState('Normal');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const success = await createTask(title.trim(), time || 'Today', priority);
    setLoading(false);

    if (success) {
      setTitle('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-6">
      <div className="hud-panel p-6 w-full max-w-md border-cyan-400/50 shadow-[0_0_30px_rgba(0,217,255,0.3)] bg-[#071124]/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
          <div className="flex items-center space-x-2.5">
            <CheckSquare className="text-cyan-400" size={24} />
            <span className="font-mono text-base font-bold text-cyan-300 uppercase tracking-wider">
              CREATE NEW MISSION TASK
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono block text-base mb-1 text-slate-300">
              Task Directive / Title
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Audit security protocols and check logs..."
              className="w-full px-3 py-2 rounded-lg bg-[#0a1834] border border-cyan-400/30 focus:border-cyan-400 text-slate-100 placeholder-slate-500 text-base font-mono focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono block text-base mb-1 text-slate-300 flex items-center gap-1">
                <CalendarIcon size={12} className="text-cyan-400" />
                <span>Scheduled Time</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 02:45 pm"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1834] border border-cyan-400/30 focus:border-cyan-400 text-slate-100 text-base font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono block text-base mb-1 text-slate-300 flex items-center gap-1">
                <Flag size={12} className="text-amber-400" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1834] border border-cyan-400/30 focus:border-cyan-400 text-slate-100 text-base font-mono focus:outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="High">High (Urgent)</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-cyan-500/20 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-base font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg text-base font-mono font-bold bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus size={14} />
              <span>{loading ? 'Scheduling...' : 'Add to Timeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
