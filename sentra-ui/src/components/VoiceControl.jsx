import React, { useState } from 'react';
import { Mic, Send, Terminal, Sparkles } from 'lucide-react';

export default function VoiceControl({
  state = 'IDLE',
  onToggleVoice,
  onSubmitText,
  disabled = false,
}) {
  const [textInput, setTextInput] = useState('');
  const isListening = state === 'LISTENING';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onSubmitText(textInput.trim());
    setTextInput('');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-3">
      {/* Central Large Reactive Microphone */}
      <div className="relative group">
        {/* Hologram Pulse Ring */}
        <div
          className={`absolute -inset-2.5 rounded-full blur-xl opacity-75 transition-all duration-500 pointer-events-none ${
            isListening
              ? 'bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400 scale-125 animate-pulse'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 group-hover:opacity-75'
          }`}
        />

        <button
          onClick={onToggleVoice}
          disabled={disabled}
          className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 transform active:scale-95 shadow-2xl z-10 ${
            isListening
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_35px_rgba(0,255,136,0.7)]'
              : 'bg-slate-900/95 border-cyan-400/60 text-cyan-300 hover:border-cyan-300 hover:text-white shadow-[0_0_25px_rgba(0,247,255,0.35)]'
          }`}
        >
          <Mic className={`w-8 h-8 mb-1 ${isListening ? 'animate-bounce' : ''}`} />
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase">
            {isListening ? 'LISTENING' : 'TALK'}
          </span>
        </button>
      </div>

      {/* Spoken State Directive Caption */}
      <div className="text-center">
        <p className="text-xs font-mono tracking-widest uppercase text-cyan-300 font-semibold">
          TALK TO SENTRA
        </p>
        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
          {isListening ? "I'm listening to your voice..." : 'Click to speak or use command input'}
        </p>
      </div>

      {/* Secondary Text / Debug Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-md px-3 py-1.5 rounded-full bg-slate-950/85 border border-slate-800 focus-within:border-cyan-400/60 transition-all shadow-inner backdrop-blur-md"
      >
        <Terminal className="w-3.5 h-3.5 text-cyan-400 mr-2 opacity-75" />
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Fallback / Debug directive..."
          className="flex-1 bg-transparent text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!textInput.trim()}
          className="p-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 disabled:opacity-30 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
