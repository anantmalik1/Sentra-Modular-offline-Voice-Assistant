'use client';

import React from 'react';
import { MOCK_METRICS } from '../data/mockData';

interface SystemMonitorProps {
  metrics?: typeof MOCK_METRICS;
}

export default function SystemMonitor({ metrics = MOCK_METRICS }: SystemMonitorProps) {
  const renderGauge = (label: string, value: number) => {
    const radius = 17;
    const circ = 2 * Math.PI * radius;
    const strokeDash = (Math.min(value, 100) / 100) * circ;

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="3.5"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="#00d9ff"
              strokeWidth="3.5"
              strokeDasharray={circ}
              strokeDashoffset={circ - strokeDash}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(0, 217, 255, 0.6))',
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center leading-none">
            <span className="font-mono text-[7px] text-slate-400 font-bold uppercase">{label}</span>
            <span className="font-mono text-[9px] font-bold text-slate-100 mt-0.5">{value}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="hud-panel p-2 flex flex-col justify-between h-full w-full">
      <div className="hud-title pb-1 border-b border-cyan-400/15 mb-1 text-[9.5px]">
        SYSTEM MONITOR
      </div>

      <div className="grid grid-cols-3 gap-1 flex-1 items-center justify-center py-0.5">
        {renderGauge('CPU', metrics.cpu)}
        {renderGauge('RAM', metrics.ram)}
        {renderGauge('DISK', metrics.disk)}
      </div>
    </div>
  );
}
