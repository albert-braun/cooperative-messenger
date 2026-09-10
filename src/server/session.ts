import { cookies } from "next/headers";
import { db, toSessionUser } from "@/server/db";
import type { SessionUser } from "@/entities/types";
import { SESSION_COOKIE } from "@/server/constants";

export { SESSION_COOKIE };

export function createSessionToken(userId: string) {
  return userId;
}

export function readSessionUserFromToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const user = db.users.find((item) => item.id === token);
  return user ? toSessionUser(user) : null;
}

export async function getCurrentUser() {
  const jar = await cookies();
  return readSessionUserFromToken(jar.get(SESSION_COOKIE)?.value);
}

export function destroySession(_token?: string) {
  return;
}
