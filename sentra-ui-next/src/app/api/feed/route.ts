import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { feedActivities, conversations } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const list = await db
    .select()
    .from(feedActivities)
    .where(eq(feedActivities.userId, user.userId))
    .orderBy(desc(feedActivities.createdAt))
    .limit(30);

  return NextResponse.json({ activities: list });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, description, tag, isVoice, transcript } = body;

  const now = new Date();
  const id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newActivity = {
    id,
    userId: user.userId,
    title: title || 'System Event',
    description: description || 'Routine telemetry update',
    tag: tag || 'LIVE',
    time: 'Just now',
    createdAt: now,
  };

  await db.insert(feedActivities).values(newActivity);

  // If this was voice input, also store in conversations table for this user
  if (isVoice && transcript) {
    await db.insert(conversations).values({
      id: `conv-${Date.now()}`,
      userId: user.userId,
      title: transcript.length > 30 ? transcript.slice(0, 30) + '...' : transcript,
      transcript,
      intent: 'VOICE_COMMAND',
      createdAt: now,
    });
  }

  return NextResponse.json({ success: true, activity: newActivity });
}
