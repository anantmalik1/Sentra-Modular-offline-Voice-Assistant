'use client';

import React, { useState } from 'react';
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

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('command_center');
  const [isListening, setIsListening] = useState(false);

  const handleToggleMic = () => {
    setIsListening((prev) => !prev);
  };

  const handleRunCommand = (cmd: string) => {
    console.log('Dispatching command:', cmd);
    setIsListening(true);
    setTimeout(() => setIsListening(false), 3000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between p-2 gap-2 bg-[#070b14] z-10 box-border">
      {/* Background Cyber Grid & Glow */}
      <div className="hud-bg-grid" />
      <div className="hud-glow" />

      {/* 1. TOP BAR */}
      <TopBar />

      {/* 2. MAIN 3-SECTION GRID CONTENT */}
      <main className="flex-1 min-h-0 flex gap-2 overflow-hidden z-10">
        {/* LEFT SIDEBAR (~210px) */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          isListening={isListening}
          onToggleMic={handleToggleMic}
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
                <QuickCommands onRunCommand={handleRunCommand} />
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
              <LLMStatus />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE INTELLIGENCE FEED (~255px) */}
        <LiveFeed />
      </main>

      {/* 3. BOTTOM BAR */}
      <BottomBar
        isListening={isListening}
        onToggleMic={handleToggleMic}
      />
    </div>
  );
}
