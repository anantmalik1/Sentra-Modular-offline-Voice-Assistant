'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your Commander name');
        return;
      }
      if (password !== confirmPassword) {
        setError('Authorization passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failure');
        setLoading(false);
        return;
      }

      // Successful login / register -> redirect to Command Center
      router.push('/');
      router.refresh();
    } catch {
      setError('Network communication failure with Sentra Core');
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#070b14] p-4">
      {/* Background Cyber Grid & Glow */}
      <div className="hud-bg-grid" />
      <div className="hud-glow" />

      {/* Futuristic Authentication Card */}
      <div className="hud-panel w-full max-w-md p-6 sm:p-8 z-10 border-cyan-400/30 shadow-[0_0_35px_rgba(0,217,255,0.25)] bg-[#071124]/95">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center pb-5 mb-5 border-b border-cyan-400/20">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.4)] mb-3">
            <Shield className="text-cyan-300 animate-pulse" size={24} />
          </div>
          <h1 className="font-mono font-black text-xl tracking-[0.2em] text-cyan-300 uppercase leading-tight">
            SENTRA CORE
          </h1>
          <p className="font-mono text-xs text-slate-400 tracking-wider mt-1">
            {isRegister ? 'OPERATOR INITIALIZATION PROTOCOL' : 'SECURE COMMANDER AUTHORIZATION'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 mb-6 rounded-lg bg-[#050c18] border border-cyan-400/20 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`py-2 rounded-md font-bold transition-all ${
              !isRegister
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,217,255,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AUTHORIZE
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`py-2 rounded-md font-bold transition-all ${
              isRegister
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,217,255,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2 p-3 mb-4 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 font-mono text-xs">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                Commander Name
              </label>
              <div className="flex items-center px-3 py-2 rounded-lg bg-[#0a1630] border border-cyan-400/25 focus-within:border-cyan-400 transition-colors">
                <User size={15} className="text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Commander Sarah"
                  className="bg-transparent text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none w-full"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1">
              Operator Email
            </label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-[#0a1630] border border-cyan-400/25 focus-within:border-cyan-400 transition-colors">
              <Mail size={15} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@sentra.ai"
                className="bg-transparent text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1">
              Passcode
            </label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-[#0a1630] border border-cyan-400/25 focus-within:border-cyan-400 transition-colors">
              <Lock size={15} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none w-full"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                Confirm Passcode
              </label>
              <div className="flex items-center px-3 py-2 rounded-lg bg-[#0a1630] border border-cyan-400/25 focus-within:border-cyan-400 transition-colors">
                <Lock size={15} className="text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none w-full"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-2.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,217,255,0.25)] cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>SYNCHRONIZING WITH CORE...</span>
            ) : (
              <>
                <span>{isRegister ? 'INITIALIZE USER & LAUNCH' : 'ENTER COMMAND CENTER'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-4 mt-6 border-t border-cyan-400/10 text-center">
          <p className="font-mono text-[10px] text-slate-500">
            SENTRA OFFLINE NEURAL PROTOCOL // ENCRYPTED ZERO-LEAKAGE LOCAL SESSION
          </p>
        </div>
      </div>
    </div>
  );
}
