import { cookies } from "next/headers";
import { db, toSessionUser } from "@/server/db";
import type { SessionUser } from "@/entities/types";
import { SESSION_COOKIE } from "@/server/constants";

export { SESSION_COOKIE };

type SessionRecord = { userId: string; expiresAt: number };

const globalStore = globalThis as typeof globalThis & {
  __nxSessions?: Map<string, SessionRecord>;
};

function sessions() {
  if (!globalStore.__nxSessions) {
    globalStore.__nxSessions = new Map();
  }
  return globalStore.__nxSessions;
}

export function createSessionToken(userId: string) {
  const token = crypto.randomUUID();
  sessions().set(token, {
    userId,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

export function readSessionUserFromToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const record = sessions().get(token);
  if (!record || record.expiresAt < Date.now()) {
    if (token) sessions().delete(token);
    return null;
  }
  const user = db.users.find((item) => item.id === record.userId);
  return user ? toSessionUser(user) : null;
}

export async function getCurrentUser() {
  const jar = await cookies();
  return readSessionUserFromToken(jar.get(SESSION_COOKIE)?.value);
}

export function destroySession(token: string | undefined) {
  if (token) sessions().delete(token);
}
