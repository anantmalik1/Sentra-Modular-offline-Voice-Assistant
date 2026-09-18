import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { agentStatuses, feedActivities } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const list = await db
    .select()
    .from(agentStatuses)
    .where(eq(agentStatuses.userId, user.userId));

  return NextResponse.json({ agents: list });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { agentId, status } = body;

  const [agent] = await db
    .select()
    .from(agentStatuses)
    .where(and(eq(agentStatuses.agentId, agentId), eq(agentStatuses.userId, user.userId)))
    .limit(1);

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const nextStatus = status || (agent.status === 'Active' ? 'Standby' : 'Active');
  const now = new Date();

  await db
    .update(agentStatuses)
    .set({
      status: nextStatus,
      updatedAt: now,
    })
    .where(and(eq(agentStatuses.agentId, agentId), eq(agentStatuses.userId, user.userId)));

  // Log state change to user feed
  await db.insert(feedActivities).values({
    id: `act-${Date.now()}`,
    userId: user.userId,
    title: `${agent.name} set to ${nextStatus}`,
    description: `Sub-agent orchestrator state updated`,
    tag: nextStatus === 'Active' ? 'LIVE' : 'INFO',
    time: 'Just now',
    createdAt: now,
  });

  return NextResponse.json({
    success: true,
    agent: { ...agent, status: nextStatus },
  });
}
