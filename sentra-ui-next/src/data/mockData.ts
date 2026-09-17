import { Agent, IntelligenceItem, TimelineTask, LLMProvider, SystemMetrics, MemoryStats } from '../types/dashboard';

export const MOCK_CORE_OVERVIEW = [
  { label: 'AI Core', value: 'Active', color: '#00d9ff' },
  { label: 'Memory', value: '3,380 Stored', color: '#00d9ff' },
  { label: 'Voice', value: 'Online', color: '#22c55e' },
  { label: 'Agents', value: '2 Running', color: '#a855f7' },
  { label: 'LLMs', value: '4 Connected', color: '#f59e0b' },
  { label: 'System', value: 'Optimal', color: '#22c55e' },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'coding',
    name: 'Coding Agent',
    role: 'Multi-Language & Logic',
    status: 'Active',
    color: '#22c55e',
    progress: 75,
  },
  {
    id: 'research',
    name: 'Research Agent',
    role: 'Information & Web Search',
    status: 'Active',
    color: '#00d9ff',
    progress: 60,
  },
  {
    id: 'memory',
    name: 'Memory Agent',
    role: 'Vector & Context Engine',
    status: 'Standby',
    color: '#a855f7',
    progress: 30,
  },
  {
    id: 'browser',
    name: 'Browser Agent',
    role: 'Web Automation & DOM',
    status: 'Standby',
    color: '#f59e0b',
    progress: 15,
  },
  {
    id: 'task',
    name: 'Task Agent',
    role: 'Dispatch & Workflow Execution',
    status: 'Standby',
    color: '#3b82f6',
    progress: 20,
  },
  {
    id: 'system',
    name: 'System Agent',
    role: 'Host Diagnostics & Automation',
    status: 'Standby',
    color: '#22c55e',
    progress: 45,
  },
];

export const MOCK_INTELLIGENCE: IntelligenceItem[] = [
  {
    id: '1',
    title: 'Design review with the product tea...',
    description: 'Meeting scheduled in boardroom alpha',
    tag: 'INFO',
    time: '11:15 am',
  },
  {
    id: '2',
    title: '2 tasks are overdue — "Polish voic...',
    description: 'Review board and reschedule pending items',
    tag: 'WARN',
    time: '10:45 am',
  },
  {
    id: '3',
    title: '3 pull requests are awaiting your revi...',
    description: 'GitHub repository sync completed',
    tag: 'TIP',
    time: '10:00 am',
  },
  {
    id: '4',
    title: 'Your deep-work block is 2–4 PM. Noti...',
    description: 'Automated focus session armed',
    tag: 'TIP',
    time: '09:40 am',
  },
  {
    id: '5',
    title: 'CPU usage at 15%',
    description: 'System load nominal across all 8 cores',
    tag: 'LIVE',
    time: 'Live',
  },
];

export const MOCK_TIMELINE: TimelineTask[] = [
  { id: '1', time: '09:30 am', title: 'Daily Standup', status: 'Done', completed: true },
  { id: '2', time: '12:00 pm', title: 'Finalize HUD panel spacing', status: 'In 42 min', completed: false },
  { id: '3', time: '02:00 pm', title: 'Deep-work block: Voice pipeline', status: 'In 2h 42m', completed: false },
  { id: '4', time: '04:30 pm', title: 'Design Review — Command Center V1', status: 'In 5h 12m', completed: false },
];

export const MOCK_PROVIDERS: LLMProvider[] = [
  { id: 'claude', name: 'Claude', status: 'Not Linked', connected: false, color: '#a855f7' },
  { id: 'openai', name: 'OpenAI', status: 'Not Linked', connected: false, color: '#22c55e' },
  { id: 'gemini', name: 'Gemini', status: 'Not Linked', connected: false, color: '#3b82f6' },
  { id: 'groq', name: 'Groq', status: 'Connected', connected: true, color: '#f59e0b' },
  { id: 'openrouter', name: 'OpenRouter', status: 'Not Linked', connected: false, color: '#64748b' },
  { id: 'ollama', name: 'Ollama', status: 'No Models', connected: false, color: '#64748b' },
  { id: 'claudecode', name: 'Claude Code', status: 'Connected', connected: true, color: '#a855f7' },
  { id: 'cursor', name: 'Cursor', status: 'Connected', connected: true, color: '#00d9ff' },
  { id: 'copilot', name: 'Copilot', status: 'Connected', connected: true, color: '#22c55e' },
];

export const MOCK_METRICS: SystemMetrics = {
  cpu: 15,
  ram: 54,
  disk: 40,
};

export const MOCK_MEMORY_STATS: MemoryStats = {
  memories: 3380,
  sessionTurns: 22,
  toolCalls: 14,
};
