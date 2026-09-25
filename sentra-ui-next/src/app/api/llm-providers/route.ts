import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { llmConnections, feedActivities } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const list = await db
    .select()
    .from(llmConnections)
    .where(eq(llmConnections.userId, user.userId));

  return NextResponse.json({ providers: list });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { providerId, connected, apiKey } = body;

  const [provider] = await db
    .select()
    .from(llmConnections)
    .where(and(eq(llmConnections.providerId, providerId), eq(llmConnections.userId, user.userId)))
    .limit(1);

  if (!provider) {
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }

  const nextConnected = connected !== undefined ? connected : !provider.connected;
  const nextStatus = nextConnected ? 'Connected' : 'Not Linked';
  const now = new Date();

  await db
    .update(llmConnections)
    .set({
      connected: nextConnected,
      status: nextStatus,
      apiKeyEncrypted: apiKey !== undefined ? apiKey : provider.apiKeyEncrypted,
      updatedAt: now,
    })
    .where(and(eq(llmConnections.providerId, providerId), eq(llmConnections.userId, user.userId)));

  // Feed log
  await db.insert(feedActivities).values({
    id: `act-${Date.now()}`,
    userId: user.userId,
    title: `${provider.name} ${nextConnected ? 'Linked' : 'Disconnected'}`,
    description: nextConnected ? 'Provider credentials active & authorized' : 'Connection unlinked by Operator',
    tag: nextConnected ? 'LIVE' : 'WARN',
    time: 'Just now',
    createdAt: now,
  });

  return NextResponse.json({
    success: true,
    provider: { ...provider, connected: nextConnected, status: nextStatus },
  });
}
