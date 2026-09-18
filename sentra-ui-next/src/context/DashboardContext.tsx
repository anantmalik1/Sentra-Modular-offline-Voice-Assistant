'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Agent, IntelligenceItem, TimelineTask, LLMProvider, SystemMetrics, MemoryStats } from '@/types/dashboard';

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardContextType {
  user: UserProfile | null;
  loading: boolean;
  tasks: TimelineTask[];
  timeline: TimelineTask[];
  agents: Agent[];
  providers: LLMProvider[];
  activities: IntelligenceItem[];
  metrics: SystemMetrics;
  memoryStats: MemoryStats;
  badgeCounts: { tasks: number; conversations: number; tools: number };
  refreshData: () => Promise<void>;
  createTask: (title: string, time: string, priority: string) => Promise<boolean>;
  toggleTask: (id: string) => Promise<void>;
  toggleTimelineTask: (id: string) => Promise<void>;
  toggleAgent: (agentId: string) => Promise<void>;
  toggleProvider: (providerId: string, apiKey?: string) => Promise<void>;
  pushActivity: (title: string, description: string, tag?: 'INFO' | 'WARN' | 'TIP' | 'LIVE', isVoice?: boolean, transcript?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TimelineTask[]>([]);
  const [timeline, setTimeline] = useState<TimelineTask[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [activities, setActivities] = useState<IntelligenceItem[]>([]);
  const [badgeCounts, setBadgeCounts] = useState({ tasks: 0, conversations: 0, tools: 18 });
  const [metrics, setMetrics] = useState<SystemMetrics>({ cpu: 15, ram: 54, disk: 40 });
  const [memoryStats, setMemoryStats] = useState<MemoryStats>({ memories: 0, sessionTurns: 0, toolCalls: 0 });

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/user-data');
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch user data');

      const data = await res.json();
      setUser(data.user);
      setTasks(data.tasks || []);
      setTimeline(data.timeline || []);
      setAgents(data.agents || []);
      setProviders(data.providers || []);
      setActivities(data.activities || []);
      if (data.badgeCounts) setBadgeCounts(data.badgeCounts);
      if (data.stats) {
        setMemoryStats({
          memories: data.stats.storedMemories || 0,
          sessionTurns: data.stats.sessionTurns || 0,
          toolCalls: data.stats.toolCalls || 0,
        });
      }
    } catch (e) {
      console.error('Data refresh error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hydrate on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Periodic System Telemetry refresh
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/system-stats');
        if (res.ok) {
          const data = await res.json();
          if (data.metrics) setMetrics(data.metrics);
        }
      } catch {}
    };

    const interval = setInterval(fetchTelemetry, 4000);
    return () => clearInterval(interval);
  }, []);

  const createTask = async (title: string, time: string, priority: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, time, priority }),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (e) {
      console.error('Toggle task error:', e);
    }
  };

  const toggleTimelineTask = async (id: string) => {
    try {
      const res = await fetch('/api/timeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (e) {
      console.error('Toggle timeline task error:', e);
    }
  };

  const toggleAgent = async (agentId: string) => {
    try {
      const res = await fetch('/api/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (e) {
      console.error('Toggle agent error:', e);
    }
  };

  const toggleProvider = async (providerId: string, apiKey?: string) => {
    try {
      const res = await fetch('/api/llm-providers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, apiKey }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (e) {
      console.error('Toggle provider error:', e);
    }
  };

  const pushActivity = async (
    title: string,
    description: string,
    tag: 'INFO' | 'WARN' | 'TIP' | 'LIVE' = 'LIVE',
    isVoice: boolean = false,
    transcript: string = ''
  ) => {
    try {
      await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tag, isVoice, transcript }),
      });
      await refreshData();
    } catch (e) {
      console.error('Push activity error:', e);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        loading,
        tasks,
        timeline,
        agents,
        providers,
        activities,
        metrics,
        memoryStats,
        badgeCounts,
        refreshData,
        createTask,
        toggleTask,
        toggleTimelineTask,
        toggleAgent,
        toggleProvider,
        pushActivity,
        logout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
