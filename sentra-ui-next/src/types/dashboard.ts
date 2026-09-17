export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Standby';
  color: string;
  progress: number;
}

export interface IntelligenceItem {
  id: string;
  title: string;
  description: string;
  tag: 'INFO' | 'WARN' | 'TIP' | 'LIVE';
  time: string;
}

export interface TimelineTask {
  id: string;
  time: string;
  title: string;
  status: 'Done' | 'Active' | string;
  completed?: boolean;
}

export interface LLMProvider {
  id: string;
  name: string;
  status: 'Connected' | 'Not Linked' | 'No Models';
  connected: boolean;
  color: string;
}

export interface SystemMetrics {
  cpu: number;
  ram: number;
  disk: number;
}

export interface MemoryStats {
  memories: number;
  sessionTurns: number;
  toolCalls: number;
}
