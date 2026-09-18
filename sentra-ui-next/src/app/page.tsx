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
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';

function DashboardContent() {
  const { pushActivity } = useDashboard();
  const [activeNav, setActiveNav] = useState('command_center');
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Modals
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isProvidersOpen, setIsProvidersOpen] = useState(false);

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
      // Gentle audio bounce fallback if microphone permission is denied in test environments
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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    setIsListening(true);
    startAudioAnalyser();

    if (!SpeechRecognition) {
      // Simulate speech recognition capture if browser doesn't support Web Speech API
      setTimeout(() => {
        const sampleCommands = [
          'Run automated security diagnostics',
          'Audit active agents and host memory',
          'Deploy code pipeline v3.0',
        ];
        const spoken = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
        pushActivity(`"${spoken}"`, 'Voice Directive Ingested & Saved', 'LIVE', true, spoken);
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

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          await pushActivity(`"${transcript.trim()}"`, 'Voice Directive Ingested', 'LIVE', true, transcript.trim());
        }
        stopAudioAnalyser();
        setIsListening(false);
      };

      recognition.onerror = () => {
        stopAudioAnalyser();
        setIsListening(false);
      };

      recognition.onend = () => {
        stopAudioAnalyser();
        setIsListening(false);
      };

      recognition.start();
    } catch {
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
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between p-2 gap-2 bg-[#070b14] z-10 box-border">
      {/* Background Cyber Grid & Glow */}
      <div className="hud-bg-grid" />
      <div className="hud-glow" />

      {/* 1. TOP BAR */}
      <TopBar onOpenSettings={() => setIsProvidersOpen(true)} />

      {/* 2. MAIN WORKSPACE */}
      {activeNav !== 'command_center' ? (
        <main className="flex-1 min-h-0 flex gap-2 overflow-hidden z-10">
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
        <main className="flex-1 min-h-0 flex gap-2 overflow-hidden z-10">
          {/* LEFT SIDEBAR (~210px) */}
          <Sidebar
            activeNav={activeNav}
            onSelectNav={setActiveNav}
            isListening={isListening}
            onToggleMic={handleToggleMic}
            audioLevel={audioLevel}
          />

          {/* CENTER STAGE (3 Rows) */}
          <div className="flex-1 flex flex-col gap-2 min-h-0 min-w-0 overflow-hidden">
            {/* Row 1: AI CORE OVERVIEW (Left) + CENTER HERO ORB (Right) */}
            <div className="flex-1 flex gap-2 min-h-0 min-w-0">
              <AICoreOverview />
              <HeroOrb isListening={isListening} />
            </div>

            {/* Row 2: ACTIVE AGENTS (Left) + MISSION TIMELINE & QUICK COMMANDS (Right) */}
            <div className="h-[145px] flex gap-2 min-h-0 min-w-0">
              <div className="flex-1 min-w-0">
                <ActiveAgents />
              </div>
              <div className="w-[390px] flex gap-2 min-w-0 flex-shrink-0">
                <div className="flex-1 min-w-0">
                  <MissionTimeline />
                </div>
                <div className="w-[155px] min-w-0 flex-shrink-0">
                  <QuickCommands
                    onOpenNewTask={() => setIsNewTaskOpen(true)}
                    onOpenCalendar={() => setActiveNav('calendar')}
                    onStartVoice={handleToggleMic}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: SYSTEM MONITOR + MEMORY INSIGHTS + LLM STATUS */}
            <div className="h-[135px] flex gap-2 min-h-0 min-w-0">
              <div className="w-[200px] flex-shrink-0 min-w-0">
                <SystemMonitor />
              </div>
              <div className="flex-1 min-w-0">
                <MemoryInsights />
              </div>
              <div className="w-[290px] flex-shrink-0 min-w-0">
                <LLMStatus onOpenManage={() => setIsProvidersOpen(true)} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE INTELLIGENCE FEED (~255px) */}
          <LiveFeed onOpenTasks={() => setActiveNav('tasks')} />
        </main>
      )}

      {/* 3. BOTTOM BAR */}
      <BottomBar
        isListening={isListening}
        onToggleMic={handleToggleMic}
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
