import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

export default function CodeModal({ codeData, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!codeData) return null;

  const handleCopy = () => {
    if (codeData.code) {
      navigator.clipboard.writeText(codeData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-3xl max-h-[85vh] glass-panel border border-cyan-500/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-100">
                {codeData.filename || 'Generated Solution'}
              </h3>
              <p className="text-[11px] font-mono text-cyan-400">
                LANG: {codeData.language?.toUpperCase() || 'PYTHON'} // AUTO-SAVED & LINKED TO VS CODE
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#050811] text-xs font-mono">
          <pre className="text-cyan-200 leading-relaxed overflow-x-auto whitespace-pre">
            {codeData.code}
          </pre>
        </div>

        {/* Output & Terminal Feedback Bar */}
        {(codeData.output || codeData.error) && (
          <div className="p-3 border-t border-slate-800 bg-black/70 font-mono text-xs">
            <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>TERMINAL EXECUTION LOG:</span>
            </div>
            {codeData.output && (
              <pre className="text-emerald-400 text-[11px] whitespace-pre-wrap max-h-24 overflow-y-auto">
                {codeData.output}
              </pre>
            )}
            {codeData.error && (
              <pre className="text-rose-400 text-[11px] whitespace-pre-wrap max-h-24 overflow-y-auto">
                {codeData.error}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
