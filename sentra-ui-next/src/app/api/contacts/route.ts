import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contacts } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('name');

    if (query) {
      const match = await db
        .select()
        .from(contacts)
        .where(
          and(
            eq(contacts.userId, user.userId),
            sql`LOWER(${contacts.name}) = LOWER(${query.trim()})`
          )
        )
        .limit(1);

      return NextResponse.json({ contact: match[0] || null });
    }

    const allContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, user.userId));

    return NextResponse.json({ contacts: allContacts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const id = `contact_${Date.now()}`;
    await db.insert(contacts).values({
      id,
      userId: user.userId,
      name: name.trim(),
      phone: phone.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, contact: { id, name, phone } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
