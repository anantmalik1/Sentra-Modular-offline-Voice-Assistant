import React from 'react';

export default function SystemMonitor({ telemetry = {} }) {
  const cpuPercent = telemetry.cpu_percent !== undefined ? Math.round(telemetry.cpu_percent) : 15;
  const ramPercent = telemetry.ram_percent !== undefined ? Math.round(telemetry.ram_percent) : 54;
  const diskPercent = 40;

  const renderGauge = (label, value) => {
    const size = 88;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * radius;
    const strokeDash = (Math.min(value, 100) / 100) * circ;

    return (
      <div className="flex flex-col items-center justify-center p-1">
        <div className="relative flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 block overflow-visible"
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Cyan progress arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#00d9ff"
              strokeWidth={strokeWidth}
              strokeDasharray={circ}
              strokeDashoffset={circ - strokeDash}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
              style={{
                filter: 'drop-shadow(0 0 5px rgba(0, 217, 255, 0.85))',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none pointer-events-none">
            <span className="font-mono text-[11px] text-slate-400 font-bold uppercase">{label}</span>
            <span className="font-mono text-[17px] font-black text-slate-100 mt-0.5">{value}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="hud-panel p-5 flex flex-col justify-between h-full w-full">
      <div className="hud-panel-title pb-2 border-b border-cyan-500/20 mb-2 text-sm font-bold">
        SYSTEM MONITOR
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1 items-center justify-center py-2 min-h-0">
        {renderGauge('CPU', cpuPercent)}
        {renderGauge('RAM', ramPercent)}
        {renderGauge('DISK', diskPercent)}
      </div>
    </div>
  );
}
