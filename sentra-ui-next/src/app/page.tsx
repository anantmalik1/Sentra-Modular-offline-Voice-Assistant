'use client';

import React, { useState, useRef } from 'react';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import AICoreOverview from '@/components/AICoreOverview';
import HeroOrb from '@/components/HeroOrb';
import LiveFeed from '@/components/LiveFeed';
import ActiveAgents from '@/components/ActiveAgents';
import MissionTimeline from '@/components/MissionTimeline';
import QuickCommands from '@/components/QuickCommands';
import SystemMonitor from '@/components/SystemMonitor';
import MemoryInsights from '@/components/MemoryInsights';
import LLMStatus from '@/components/LLMStatus';
import BottomBar from '@/components/BottomBar';
import SubView from '@/components/SubView';
import NewTaskModal from '@/components/NewTaskModal';
import ProvidersModal from '@/components/ProvidersModal';
import QuickSwitcherModal from '@/components/QuickSwitcherModal';
import SettingsModal from '@/components/SettingsModal';
import ExecutiveBriefingModal from '@/components/ExecutiveBriefingModal';
import { executeVoiceOrWebCommand } from '@/lib/commandParser';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';

function DashboardContent() {
  const { pushActivity, createTask, tasks } = useDashboard();
  const [activeNav, setActiveNav] = useState('command_center');
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Modals
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isProvidersOpen, setIsProvidersOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);

  // Audio Context & Speech Recognition Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Web Audio Analyser
  const startAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length / 255;
        setAudioLevel(avg);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (e) {
      // Gentle audio bounce fallback if microphone permission is denied or pending in test environments
      let phase = 0;
      const mockLoop = () => {
        phase += 0.2;
        setAudioLevel(0.35 + Math.sin(phase) * 0.25);
        animFrameRef.current = requestAnimationFrame(mockLoop);
      };
      mockLoop();
    }
  };

  const stopAudioAnalyser = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  const stopVoiceRecognition = () => {
    console.log('[SENTRA Voice] stopVoiceRecognition called');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    stopAudioAnalyser();
    setIsListening(false);
  };

  const startVoiceRecognition = () => {
    // Immediate visible state change on click
    setIsListening(true);
    startAudioAnalyser();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('[SENTRA Voice] Web Speech API not supported in this browser environment. Using demo simulated directive.');
      setTimeout(async () => {
        const sampleCommands = [
          'open youtube',
          'play synthwave radio',
          'search for quantum computing',
          'create task Review mission parameters',
        ];
        const spoken = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
        const res = await executeVoiceOrWebCommand(spoken, { createTask, tasks });
        await pushActivity(res.feedbackTitle, res.feedbackDesc, res.tag, true, spoken);
        stopAudioAnalyser();
        setIsListening(false);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        console.log('[SENTRA Voice] recognition.onstart - Microphone listening active');
      };

      recognition.onresult = async (event: any) => {
        console.log('[SENTRA Voice] recognition.onresult fired', event);
        const transcript = event.results[0][0]?.transcript;
        if (transcript) {
          const trimmed = transcript.trim();
          console.log('[SENTRA Voice] Transcribed speech:', trimmed);
          // Execute command parser
          const result = await executeVoiceOrWebCommand(trimmed, { createTask, tasks });
          await pushActivity(result.feedbackTitle, result.feedbackDesc, result.tag, true, trimmed);
        }
        stopAudioAnalyser();
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('[SENTRA Voice] recognition.onerror:', err.error, err);
        stopAudioAnalyser();
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('[SENTRA Voice] recognition.onend');
        stopAudioAnalyser();
        setIsListening(false);
      };

      recognition.start();
      console.log('[SENTRA Voice] recognition.start() initiated successfully');
    } catch (err) {
      console.error('[SENTRA Voice] Failed to start recognition instance:', err);
      stopAudioAnalyser();
      setIsListening(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  return (
    <div className="relative w-screen min-h-screen flex flex-col justify-between p-4 gap-4 bg-[#070b14] z-10 box-border overflow-y-auto">
      {/* Background Cyber Grid & Glow */}
      <div className="hud-bg-grid" />
      <div className="hud-glow" />

      {/* 1. TOP BAR */}
      <TopBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSwitcher={() => setIsSwitcherOpen(true)}
      />

      {/* 2. MAIN WORKSPACE */}
      {activeNav !== 'command_center' ? (
        <main className="flex-1 flex gap-4 min-h-[750px] z-10">
          <Sidebar
            activeNav={activeNav}
            onSelectNav={setActiveNav}
            isListening={isListening}
            onToggleMic={handleToggleMic}
            audioLevel={audioLevel}
          />
          <SubView
            viewId={activeNav}
            onBack={() => setActiveNav('command_center')}
            onOpenNewTask={() => setIsNewTaskOpen(true)}
          />
        </main>
      ) : (
        <main className="flex-1 flex gap-4 z-10">
          {/* LEFT SIDEBAR (~260px) */}
          <Sidebar
            activeNav={activeNav}
            onSelectNav={setActiveNav}
            isListening={isListening}
            onToggleMic={handleToggleMic}
            audioLevel={audioLevel}
          />

          {/* CENTER STAGE (3 Spacious Rows) */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Row 1: AI CORE OVERVIEW (Left) + CENTER HERO ORB (Right) */}
            <div className="flex gap-4 min-h-[380px]">
              <AICoreOverview />
              <HeroOrb isListening={isListening} />
            </div>

            {/* Row 2: ACTIVE AGENTS (Left) + MISSION TIMELINE & QUICK COMMANDS (Right) */}
            <div className="flex gap-4 min-h-[280px]">
              <div className="flex-1 min-w-0">
                <ActiveAgents />
              </div>
              <div className="w-[440px] flex gap-4 min-w-0 flex-shrink-0">
                <div className="flex-1 min-w-0">
                  <MissionTimeline />
                </div>
                <div className="w-[190px] min-w-0 flex-shrink-0">
                  <QuickCommands
                    onOpenNewTask={() => setIsNewTaskOpen(true)}
                    onOpenCalendar={() => setActiveNav('calendar')}
                    onStartVoice={handleToggleMic}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: SYSTEM MONITOR + MEMORY INSIGHTS + LLM STATUS */}
            <div className="flex gap-4 min-h-[220px]">
              <div className="w-[260px] flex-shrink-0 min-w-0">
                <SystemMonitor />
              </div>
              <div className="flex-1 min-w-0">
                <MemoryInsights />
              </div>
              <div className="w-[340px] flex-shrink-0 min-w-0">
                <LLMStatus onOpenManage={() => setIsProvidersOpen(true)} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE INTELLIGENCE FEED (~320px) */}
          <LiveFeed onOpenTasks={() => setActiveNav('tasks')} />
        </main>
      )}

      {/* 3. BOTTOM BAR */}
      <BottomBar
        isListening={isListening}
        onToggleMic={handleToggleMic}
        onOpenBriefing={() => setIsBriefingOpen(true)}
      />

      {/* MODALS */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />

      <ProvidersModal
        isOpen={isProvidersOpen}
        onClose={() => setIsProvidersOpen(false)}
      />

      <QuickSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
        onSelectNav={(id) => {
          setActiveNav(id);
          setIsSwitcherOpen(false);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ExecutiveBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
