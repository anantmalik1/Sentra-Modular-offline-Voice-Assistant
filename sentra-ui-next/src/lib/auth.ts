import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  COOKIE_NAME,
  UserSessionPayload,
  createSessionToken,
  verifySessionToken,
} from './jwt';

export { COOKIE_NAME, type UserSessionPayload, createSessionToken, verifySessionToken };

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  // Verify user still exists in DB
  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!existingUser) return null;

  return {
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
  };
}
