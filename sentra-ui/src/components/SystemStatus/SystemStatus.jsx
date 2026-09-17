import React from 'react';
import { Cpu, HardDrive, Wifi, Shield, Database, Radio } from 'lucide-react';

export default function SystemStatus({
  backendStatus = 'CONNECTED',
  mode = 'HYBRID',
  aiBrain = 'ONLINE',
  voiceEngine = 'READY',
  telemetry = {},
}) {
  const isOnline = backendStatus === 'CONNECTED';

  return (
    <div className="flex items-center space-x-3 text-xs font-mono">
      {/* Backend & Mode Pill */}
      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 shadow-sm backdrop-blur-md">
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
          }`}
        />
        <span className="text-slate-300 font-semibold">{mode} MODE</span>
        <span className="text-slate-600">|</span>
        <span className="text-cyan-400">{backendStatus}</span>
      </div>

      {/* AI Brain Pill */}
      <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400">
        <Shield className="w-3 h-3 text-cyan-400" />
        <span className="text-[11px]">AI BRAIN:</span>
        <span className={aiBrain.includes('ONLINE') ? 'text-emerald-400' : 'text-amber-400'}>
          {aiBrain}
        </span>
      </div>

      {/* Voice Engine Pill */}
      <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400">
        <Radio className="w-3 h-3 text-purple-400" />
        <span className="text-[11px]">VOICE:</span>
        <span className="text-purple-300">{voiceEngine}</span>
      </div>

      {/* CPU / RAM Telemetry */}
      {telemetry.cpu_percent !== undefined && (
        <div className="hidden xl:flex items-center space-x-3 px-2.5 py-1 rounded-full bg-slate-900/40 border border-slate-800 text-slate-500 text-[10px]">
          <div className="flex items-center space-x-1">
            <Cpu className="w-2.5 h-2.5 text-cyan-400" />
            <span>CPU {telemetry.cpu_percent}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <HardDrive className="w-2.5 h-2.5 text-cyan-400" />
            <span>RAM {telemetry.ram_percent}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
