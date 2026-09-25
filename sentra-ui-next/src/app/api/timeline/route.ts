import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { timelineTasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const list = await db
    .select()
    .from(timelineTasks)
    .where(eq(timelineTasks.userId, user.userId))
    .orderBy(timelineTasks.orderIdx);

  return NextResponse.json({ timeline: list });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { time, title, status } = body;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const id = `tm-${Date.now()}`;
  const newItem = {
    id,
    userId: user.userId,
    time: time || '12:00 pm',
    title: title.trim(),
    status: status || 'In progress',
    completed: false,
    orderIdx: 0,
    createdAt: new Date(),
  };

  await db.insert(timelineTasks).values(newItem);

  return NextResponse.json({ success: true, item: newItem });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, completed } = body;

  const [existing] = await db
    .select()
    .from(timelineTasks)
    .where(and(eq(timelineTasks.id, id), eq(timelineTasks.userId, user.userId)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: 'Timeline task not found' }, { status: 404 });
  }

  const updatedCompleted = completed !== undefined ? completed : !existing.completed;
  const updatedStatus = updatedCompleted ? 'Done' : 'Active';

  await db
    .update(timelineTasks)
    .set({
      completed: updatedCompleted,
      status: updatedStatus,
    })
    .where(and(eq(timelineTasks.id, id), eq(timelineTasks.userId, user.userId)));

  return NextResponse.json({ success: true });
}
