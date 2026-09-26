import { db } from '@/db';
import {
  agentStatuses,
  llmConnections,
  feedActivities,
  contacts,
} from '@/db/schema';

export async function seedUserDefaultState(userId: string) {
  const now = new Date();

  // 1. Seed Default Sub-Agents
  const defaultAgents = [
    {
      id: `${userId}-coding`,
      userId,
      agentId: 'coding',
      name: 'Coding Agent',
      role: 'Multi-Language & Logic',
      status: 'Active',
      progress: 75,
      color: '#22c55e',
      updatedAt: now,
    },
    {
      id: `${userId}-research`,
      userId,
      agentId: 'research',
      name: 'Research Agent',
      role: 'Information & Web Search',
      status: 'Active',
      progress: 60,
      color: '#00d9ff',
      updatedAt: now,
    },
    {
      id: `${userId}-memory`,
      userId,
      agentId: 'memory',
      name: 'Memory Agent',
      role: 'Vector & Context Engine',
      status: 'Standby',
      progress: 30,
      color: '#a855f7',
      updatedAt: now,
    },
    {
      id: `${userId}-browser`,
      userId,
      agentId: 'browser',
      name: 'Browser Agent',
      role: 'Web Automation & DOM',
      status: 'Standby',
      progress: 15,
      color: '#f59e0b',
      updatedAt: now,
    },
    {
      id: `${userId}-task`,
      userId,
      agentId: 'task',
      name: 'Task Agent',
      role: 'Dispatch & Workflow Execution',
      status: 'Standby',
      progress: 20,
      color: '#3b82f6',
      updatedAt: now,
    },
    {
      id: `${userId}-system`,
      userId,
      agentId: 'system',
      name: 'System Agent',
      role: 'Host Diagnostics & Automation',
      status: 'Standby',
      progress: 45,
      color: '#22c55e',
      updatedAt: now,
    },
  ];

  for (const agent of defaultAgents) {
    await db.insert(agentStatuses).values(agent);
  }

  // 2. Seed Default LLM Providers (Not linked initially)
  const defaultProviders = [
    { id: `${userId}-claude`, userId, providerId: 'claude', name: 'Claude', status: 'Not Linked', connected: false, color: '#a855f7', updatedAt: now },
    { id: `${userId}-openai`, userId, providerId: 'openai', name: 'OpenAI', status: 'Not Linked', connected: false, color: '#22c55e', updatedAt: now },
    { id: `${userId}-gemini`, userId, providerId: 'gemini', name: 'Gemini', status: 'Not Linked', connected: false, color: '#3b82f6', updatedAt: now },
    { id: `${userId}-groq`, userId, providerId: 'groq', name: 'Groq', status: 'Connected', connected: true, color: '#f59e0b', updatedAt: now },
    { id: `${userId}-openrouter`, userId, providerId: 'openrouter', name: 'OpenRouter', status: 'Not Linked', connected: false, color: '#64748b', updatedAt: now },
    { id: `${userId}-ollama`, userId, providerId: 'ollama', name: 'Ollama', status: 'No Models', connected: false, color: '#64748b', updatedAt: now },
    { id: `${userId}-claudecode`, userId, providerId: 'claudecode', name: 'Claude Code', status: 'Connected', connected: true, color: '#a855f7', updatedAt: now },
    { id: `${userId}-cursor`, userId, providerId: 'cursor', name: 'Cursor', status: 'Connected', connected: true, color: '#00d9ff', updatedAt: now },
    { id: `${userId}-copilot`, userId, providerId: 'copilot', name: 'Copilot', status: 'Connected', connected: true, color: '#22c55e', updatedAt: now },
  ];

  for (const provider of defaultProviders) {
    await db.insert(llmConnections).values(provider);
  }

  // 3. Seed welcome activity feed message
  await db.insert(feedActivities).values({
    id: `${userId}-welcome`,
    userId,
    title: 'Sentra Neural Node Initialized',
    description: 'Operator session established. Awaiting directives.',
    tag: 'LIVE',
    time: 'Now',
    createdAt: now,
  });

  // 4. Seed sample contact for voice directives
  try {
    await db.insert(contacts).values([
      {
        id: `${userId}-contact-mom`,
        userId,
        name: 'Mom',
        phone: '+919876543210',
        createdAt: now,
      },
      {
        id: `${userId}-contact-anant`,
        userId,
        name: 'Anant',
        phone: '+919999999999',
        createdAt: now,
      },
    ]);
  } catch {}
}
