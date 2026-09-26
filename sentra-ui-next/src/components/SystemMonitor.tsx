'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function SystemMonitor() {
  const { metrics } = useDashboard();

  const renderGauge = (label: string, value: number) => {
    const radius = 26;
    const circ = 2 * Math.PI * radius;
    const strokeDash = (Math.min(value, 100) / 100) * circ;

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-18 h-18 flex items-center justify-center">
          <svg className="w-18 h-18 transform -rotate-90">
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#00d9ff"
              strokeWidth="4"
              strokeDasharray={circ}
              strokeDashoffset={circ - strokeDash}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
              style={{
                filter: 'drop-shadow(0 0 5px rgba(0, 217, 255, 0.7))',
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center leading-none">
            <span className="font-mono text-[13px] text-slate-400 font-bold uppercase">{label}</span>
            <span className="font-mono text-[19px] font-bold text-slate-100 mt-1">{value}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="hud-panel p-6 flex flex-col justify-between h-full w-full">
      <div className="hud-title pb-2 border-b border-cyan-400/15 mb-2">
        SYSTEM MONITOR
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1 items-center justify-center py-1">
        {renderGauge('CPU', metrics.cpu)}
        {renderGauge('RAM', metrics.ram)}
        {renderGauge('DISK', metrics.disk)}
      </div>
    </div>
  );
}
