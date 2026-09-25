import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { tasks, conversations, memoryEntries } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const queryPattern = `%${q}%`;

  // Search tasks, conversations, and memories scoped by user_id
  const [matchingTasks, matchingConversations, matchingMemories] = await Promise.all([
    db
      .select({
        id: tasks.id,
        title: tasks.title,
        detail: tasks.time,
      })
      .from(tasks)
      .where(or(like(tasks.title, queryPattern)))
      .limit(5),

    db
      .select({
        id: conversations.id,
        title: conversations.title,
        detail: conversations.transcript,
      })
      .from(conversations)
      .where(or(like(conversations.title, queryPattern), like(conversations.transcript, queryPattern)))
      .limit(5),

    db
      .select({
        id: memoryEntries.id,
        title: memoryEntries.key,
        detail: memoryEntries.value,
      })
      .from(memoryEntries)
      .where(or(like(memoryEntries.key, queryPattern), like(memoryEntries.value, queryPattern)))
      .limit(5),
  ]);

  const results = [
    ...matchingTasks.map((t) => ({ ...t, type: 'TASK' })),
    ...matchingConversations.map((c) => ({ ...c, type: 'CONVERSATION' })),
    ...matchingMemories.map((m) => ({ ...m, type: 'MEMORY' })),
  ];

  return NextResponse.json({ results });
}
