import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, createSessionToken, COOKIE_NAME } from '@/lib/auth';
import { seedUserDefaultState } from '@/lib/seed';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: 'An operator account with this email already exists' },
        { status: 409 }
      );
    }

    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const passwordHash = await hashPassword(password);
    const now = new Date();

    await db.insert(users).values({
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'Commander',
      createdAt: now,
    });

    // Seed clean starter state for this specific user
    await seedUserDefaultState(userId);

    // Create session token
    const token = await createSessionToken({
      userId,
      email: cleanEmail,
      name: name.trim(),
      role: 'Commander',
    });

    const response = NextResponse.json({
      success: true,
      user: { id: userId, email: cleanEmail, name: name.trim(), role: 'Commander' },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: 'Internal system failure during registration' },
      { status: 500 }
    );
  }
}
