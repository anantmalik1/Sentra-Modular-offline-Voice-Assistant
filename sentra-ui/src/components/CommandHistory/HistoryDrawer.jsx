import React from 'react';
import { History, Trash2, CheckCircle2, XCircle, Code2, Video, Search, Clock, MessageSquare, ExternalLink } from 'lucide-react';

export default function HistoryDrawer({ history = [], onClear, onViewCode }) {
  const getIntentIcon = (intent) => {
    switch (intent) {
      case 'write_code':
        return <Code2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'play_youtube':
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case 'search':
        return <Search className="w-3.5 h-3.5 text-cyan-400" />;
      case 'tell_time':
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel p-4 overflow-hidden border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/15">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-cyan-400" />
          <span className="hud-label text-slate-200">Execution Log</span>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 hover:text-rose-400 transition-colors p-1 rounded hover:bg-slate-800/60"
            title="Purge command history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>PURGE</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-center text-slate-500">
            <History className="w-8 h-8 mb-2 opacity-30 text-cyan-400" />
            <p className="text-xs font-mono">HISTORY BUFFER EMPTY</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Executions will be recorded here</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/70 hover:border-cyan-500/30 transition-all text-xs font-mono"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1.5 text-cyan-300">
                  {getIntentIcon(item.intent)}
                  <span className="text-[10px] uppercase font-bold text-cyan-400">
                    {item.intent || 'COMMAND'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                  {item.status === 'SUCCESS' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>
              </div>

              <p className="text-slate-200 text-xs truncate mb-1">
                "{item.command}"
              </p>

              {item.message && (
                <p className="text-slate-400 text-[11px] line-clamp-2 bg-slate-950/40 p-1.5 rounded border border-slate-800/40">
                  {item.message}
                </p>
              )}

              {item.intent === 'write_code' && item.data?.code && (
                <button
                  onClick={() => onViewCode(item.data)}
                  className="mt-2 flex items-center justify-center space-x-1 py-1 px-2 rounded bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-[10px] transition-colors"
                >
                  <Code2 className="w-3 h-3" />
                  <span>INSPECT GENERATED CODE</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
