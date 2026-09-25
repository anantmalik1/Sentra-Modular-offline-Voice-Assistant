import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import {
  tasks,
  timelineTasks,
  agentStatuses,
  llmConnections,
  feedActivities,
  memoryEntries,
  conversations,
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.userId;

  // Scoped queries: ONLY load records belonging to this user_id
  const [
    userTasks,
    userTimeline,
    userAgents,
    userProviders,
    userActivities,
    userMemories,
    userConversations,
  ] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt)),
    db.select().from(timelineTasks).where(eq(timelineTasks.userId, userId)).orderBy(timelineTasks.orderIdx),
    db.select().from(agentStatuses).where(eq(agentStatuses.userId, userId)),
    db.select().from(llmConnections).where(eq(llmConnections.userId, userId)),
    db.select().from(feedActivities).where(eq(feedActivities.userId, userId)).orderBy(desc(feedActivities.createdAt)).limit(20),
    db.select().from(memoryEntries).where(eq(memoryEntries.userId, userId)),
    db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.createdAt)),
  ]);

  // Compute live counts and status indicators
  const activeTasksCount = userTasks.filter((t) => !t.completed).length;
  const activeAgentsCount = userAgents.filter((a) => a.status === 'Active').length;
  const connectedProvidersCount = userProviders.filter((p) => p.connected).length;
  const storedMemoriesCount = userMemories.length;

  return NextResponse.json({
    user,
    tasks: userTasks,
    timeline: userTimeline,
    agents: userAgents,
    providers: userProviders,
    activities: userActivities,
    memories: userMemories,
    conversations: userConversations,
    stats: {
      activeTasks: activeTasksCount,
      activeAgents: activeAgentsCount,
      connectedProviders: connectedProvidersCount,
      storedMemories: storedMemoriesCount,
      sessionTurns: userConversations.length,
      toolCalls: Math.max(userTasks.length * 2, 4),
    },
    badgeCounts: {
      tasks: activeTasksCount,
      conversations: userConversations.length,
      tools: 18,
    },
  });
}
