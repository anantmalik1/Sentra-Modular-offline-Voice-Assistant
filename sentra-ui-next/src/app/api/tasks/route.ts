import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { tasks, feedActivities } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

// GET all tasks for logged in user
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const list = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, user.userId))
    .orderBy(desc(tasks.createdAt));

  return NextResponse.json({ tasks: list });
}

// POST: Create a task for logged in user
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, time, priority } = body;

  if (!title) {
    return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
  }

  const taskId = `tsk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date();

  const newTask = {
    id: taskId,
    userId: user.userId,
    title: title.trim(),
    time: time || 'Today',
    priority: priority || 'Normal',
    status: 'Active',
    completed: false,
    createdAt: now,
  };

  await db.insert(tasks).values(newTask);

  // Also log to Live Feed for this user
  await db.insert(feedActivities).values({
    id: `act-${Date.now()}`,
    userId: user.userId,
    title: `Task Created: "${title.trim()}"`,
    description: `Assigned priority: ${priority || 'Normal'} (${time || 'Today'})`,
    tag: 'INFO',
    time: 'Just now',
    createdAt: now,
  });

  return NextResponse.json({ success: true, task: newTask });
}

// PATCH: Toggle task completion / update
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, completed, status } = body;

  if (!id) {
    return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
  }

  // Ensure task belongs to current user
  const [existing] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.userId)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
  }

  const updatedCompleted = completed !== undefined ? completed : !existing.completed;
  const updatedStatus = status !== undefined ? status : updatedCompleted ? 'Done' : 'Active';

  await db
    .update(tasks)
    .set({
      completed: updatedCompleted,
      status: updatedStatus,
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.userId)));

  return NextResponse.json({
    success: true,
    task: { ...existing, completed: updatedCompleted, status: updatedStatus },
  });
}
